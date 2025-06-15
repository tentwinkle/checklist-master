
import * as admin from 'firebase-admin';

let adminInitialized = false;
let authInstance: admin.auth.Auth | null = null;
// dbInstance for Firestore is removed as user data will be in PostgreSQL

function initializeAdminApp() {
  console.log('[SERVER LOG] initializeAdminApp function called.');
  if (!admin.apps.length) {
    try {
      console.log('[SERVER LOG] Attempting to initialize Firebase Admin SDK...');
      const serviceAccountJsonString = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
      
      if (!serviceAccountJsonString) {
        console.error('[SERVER LOG] CRITICAL ERROR: FIREBASE_SERVICE_ACCOUNT_JSON environment variable is not set or empty.');
        console.error('[SERVER LOG] Ensure this variable is set in your .env.local file with the JSON content of your service account key as a single-line string.');
        throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON environment variable is not set. This is required for Firebase Admin SDK.');
      }
      
      console.log('[SERVER LOG] FIREBASE_SERVICE_ACCOUNT_JSON environment variable found. Length:', serviceAccountJsonString.length);
      console.log('[SERVER LOG] First 100 chars of FIREBASE_SERVICE_ACCOUNT_JSON:', serviceAccountJsonString.substring(0,100) + (serviceAccountJsonString.length > 100 ? '...' : ''));

      let serviceAccount;
      try {
        serviceAccount = JSON.parse(serviceAccountJsonString);
        console.log('[SERVER LOG] FIREBASE_SERVICE_ACCOUNT_JSON parsed successfully.');
      } catch (parseError: any) {
        console.error('[SERVER LOG] CRITICAL ERROR: Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON.');
        console.error('[SERVER LOG] Ensure it is a valid JSON string. Specifically, the private_key field often needs newlines escaped as \\n to be a valid single-line JSON string value.');
        console.error('[SERVER LOG] Parse Error:', parseError.message);
        throw new Error('Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON.');
      }

      if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
        console.error('[SERVER LOG] CRITICAL ERROR: Parsed service account JSON is missing required fields (project_id, private_key, client_email).');
        console.error('[SERVER LOG] Found project_id:', serviceAccount.project_id);
        console.error('[SERVER LOG] Private key exists:', !!serviceAccount.private_key);
        console.error('[SERVER LOG] Client email exists:', !!serviceAccount.client_email);
        throw new Error('Service account JSON is malformed or missing required fields.');
      }
      
      console.log('[SERVER LOG] Service account JSON seems valid. Project ID from JSON:', serviceAccount.project_id);
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      
      adminInitialized = true;
      authInstance = admin.auth();
      // dbInstance = admin.firestore(); // Removed Firestore instance
      console.log('[SERVER LOG] Firebase Admin SDK initialized SUCCESSFULLY for project (Auth service only):', serviceAccount.project_id);

    } catch (error: any) {
      console.error('--------------------------------------------------------------------');
      console.error('[SERVER LOG] CRITICAL: Firebase Admin SDK initialization FAILED.');
      console.error('[SERVER LOG] Error Message:', error.message);
      console.error('[SERVER LOG] This means the server cannot connect to Firebase services (e.g., Auth).');
      console.error('[SERVER LOG] COMMON CAUSES:');
      console.error('[SERVER LOG] 1. `FIREBASE_SERVICE_ACCOUNT_JSON` in .env.local is missing, malformed, or not a valid single-line string (private_key newlines MUST be `\\n`).');
      console.error('[SERVER LOG] 2. The Next.js server was not restarted after changing .env.local.');
      console.error('[SERVER LOG] Please check the detailed logs above this message and your .env.local file.');
      console.error('--------------------------------------------------------------------');
    }
  } else {
    if (!adminInitialized) { 
        authInstance = admin.auth();
        adminInitialized = true; 
        console.log('[SERVER LOG] Firebase Admin SDK was already initialized by Firebase; local state updated (Auth service only).');
    } else {
        console.log('[SERVER LOG] Firebase Admin SDK was already initialized (local state agrees - Auth service only).');
    }
  }
}

initializeAdminApp();

export function getFirebaseAdminAuth() {
  if (!adminInitialized || !authInstance) { 
    console.error("[SERVER LOG] CRITICAL: Attempted to get Firebase Admin Auth, but SDK is not properly initialized. Check server startup logs for initialization errors.");
    throw new Error("Firebase Admin SDK Auth service not initialized. Check server logs for details.");
  }
  return authInstance;
}

// firebaseAdminDb is removed
export const firebaseAdminAuth = authInstance;
// export const firebaseAdminDb = null; // Or remove entirely
