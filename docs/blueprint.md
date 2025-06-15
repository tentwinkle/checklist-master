# **App Name**: Inspection System for Region Holbæk

## Core Features:

- Super Admin Features: Add new organizations (companies). Add the first administrator for each organization. Automatically send login email to new admins (email/password based). View and manage all organizations.
- Organization Admin Features: Secure login (use Firebase Authentication). Manage users (admin or inspector roles). Create and manage departments under their organization. Update own email and password. All access should be role-based using Firebase Auth and Firestore security rules.
- Master Checklist Templates: Each department can have templates (e.g., Fire Extinguishers, Vehicles). Admins can define items and control intervals (weekly, bi-weekly, monthly, etc.). Include buffer days (e.g., mark as orange 16 days before due).
- Inspection & QR Code Use: Users (inspectors) scan a unique QR code to load an item from a checklist. Mark each item as "Approved" or "Not Approved". Optional: Add notes (mandatory if Not Approved), photos. When all items are marked, the report can be finalized
- Report Locking & Compliance: Once submitted, reports are locked (immutable). Reports must remain unaffected by future edits to users, items, or templates. Save report snapshot to Firestore and generate downloadable PDF
- Visual Status Colors: Visual status colors: Green = Completed, Orange = Upcoming, Red = Overdue
- Admin dashboard: View all submitted reports. Mark "Not Approved" items with follow-up notes and dates
- Inspector App: Mobile-optimized web app. Allow navigation across checklist items

## Style Guidelines:

- Primary color: A vibrant blue (#29ABE2) to convey trust and professionalism.
- Background color: Light gray (#F0F2F5), offering a clean and unobtrusive backdrop.
- Accent color: A vivid green (#90EE90) to highlight approval and positive status.
- Body and headline font: 'Inter', a sans-serif font that ensures readability and a modern feel.
- Use clear and concise icons for navigation and checklist items, with green checkmarks and red crosses indicating approval status.
- Implement a responsive, grid-based layout optimized for mobile devices, ensuring easy navigation and accessibility on small screens.
- Use subtle transitions and animations to enhance user experience, such as checklist completion and loading states.