
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, connectAuthEmulator, type Auth } from "firebase/auth";

// Store instances in module scope but do not initialize them immediately.
let appInstance: FirebaseApp | null = null;
let authServiceInstance: Auth | null = null;

/**
 * Initializes and returns the Firebase app instance.
 * Ensures that Firebase is initialized only once.
 */
export const getFirebaseApp = (): FirebaseApp => {
  if (!appInstance) {
    if (getApps().length === 0) {
      const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
      };

      // Critical check for essential Firebase config
      if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
        const errorMessage = "Firebase configuration error: API Key or Project ID is missing. " +
          "Ensure NEXT_PUBLIC_FIREBASE_API_KEY and NEXT_PUBLIC_FIREBASE_PROJECT_ID are correctly set in your .env file (e.g., .env.local) " +
          "at the root of your project, and that the Next.js development server has been restarted.";
        console.error(errorMessage);
        // This will stop execution if config is bad, giving a clearer signal
        // It's better to throw here than let Firebase SDK throw a less specific error later.
        throw new Error(errorMessage);
      }
      
      appInstance = initializeApp(firebaseConfig);
      console.log(`Firebase App initialized for project: ${firebaseConfig.projectId}. API Key Present: ${!!firebaseConfig.apiKey}`);
    } else {
      appInstance = getApps()[0];
      // console.log("Firebase App already initialized, using existing instance."); // Can be noisy
    }
  }
  return appInstance;
};

/**
 * Initializes and returns the Firebase Auth instance.
 * Ensures that Auth is initialized only once and connected to the emulator if configured.
 */
export const getFirebaseAuth = (): Auth => {
  if (!authServiceInstance) {
    const currentApp = getFirebaseApp(); // Ensures app is initialized first, will throw if config is bad.
    authServiceInstance = getAuth(currentApp);
    // console.log("Firebase Auth service initialized."); // Can be noisy

    if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
      if (typeof window !== 'undefined') { 
        // @ts-ignore - _emulatorConfig is an internal property but useful here to check if already connected.
        if (!authServiceInstance._emulatorConfig) {
          // console.log("Attempting to connect to Firebase Auth Emulator on http://localhost:9099");
          try {
            connectAuthEmulator(authServiceInstance, "http://localhost:9099", { disableWarnings: true });
            // console.log("Successfully connected to Firebase Auth Emulator.");
          } catch (error) {
            console.error("Failed to connect to Firebase Auth Emulator:", error);
          }
        }
      }
    }
  }
  return authServiceInstance;
};
