# Firestore schema and Firebase setup (SkinTrade)

Collections:

- `skins` (documents keyed by skin id)
  - id: string (doc id)
  - name: string
  - game: string
  - rarity: string
  - price: number
  - image: { imageUrl: string, imageHint?: string }
  - description: string

- `purchases` (documents keyed by purchase id)
  - id: string (doc id)
  - userId: string (uid from Firebase Auth)
  - skinId: string (ref to skins)
  - purchaseDate: timestamp

Recommended Firestore rules (start safe, then relax for MVP):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /skins/{skinId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }

    match /purchases/{purchaseId} {
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

Firebase Auth:

- Use Email/Password provider for basic registration/login.
- Use custom claims (`admin`) for admin users (set via Admin SDK).

Notes:

- For local development, enable the Firebase emulators (Auth + Firestore) and point your app to those endpoints.
- Store Firebase credentials and config in environment variables (`FIREBASE_*`) and initialize the SDK in `src/lib/firebase.ts`.
