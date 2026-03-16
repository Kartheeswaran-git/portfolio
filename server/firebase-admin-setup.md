# Firebase Admin Setup for Backend

To allow the Express backend to securely connect to Firestore, you need to provide a Service Account Key.

## Steps to generate the key:

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your project: `portfoilo-2feb4`.
3. Click on the **Gear icon (Project settings)** next to "Project Overview".
4. Go to the **Service accounts** tab.
5. Click **Generate new private key**.
6. Download the JSON file.
7. Rename the file to `serviceAccountKey.json`.
8. Place this file in the `server/` directory of your project.

> [!IMPORTANT]
> **Never commit this JSON file to version control (git).** It contains sensitive credentials that grant full access to your Firebase project.

## Current Status
The backend code is configured to look for `server/serviceAccountKey.json`. If it's missing, the server will log an error but still try to run (though Firestore calls will fail).
