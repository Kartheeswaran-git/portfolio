# Portfolio Admin App

This project runs at `http://localhost:3000` and includes:

- Public portfolio page at `/`
- Admin page at `/admin`
- Firebase email/password login
- Firestore-backed portfolio data

## Firestore Setup

The admin page writes portfolio data to:

- Collection: `siteContent`
- Document: `portfolio`

If you see `Firestore permission denied`, publish rules like the ones in [firestore.rules](/Users/kartheeswaran/Desktop/karthee%20project/portfolio/portfolio/firestore.rules).

Rules used for current development:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /siteContent/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## How To Fix Permission Denied

1. Open Firebase Console
2. Go to `Firestore Database`
3. Open the `Rules` tab
4. Replace the rules with the contents of `firestore.rules`
5. Click `Publish`

## Auth

Enable `Authentication > Sign-in method > Email/Password` in Firebase and log in at `/admin` with that user.
# portfolio
