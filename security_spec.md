# Security Spec

## 1. Data Invariants
- A chat record cannot be created without a valid string query, valid string report, and numeric timestamp.
- A user can only read and write chat records in their own user subcollection (`/users/{userId}/chats/{chatId}`).

## 2. Dirty Dozen Payloads
- 1. Unauthenticated write attempt.
- 2. Authenticated write to another user's collection.
- 3. Missing `timestamp`.
- 4. Extra fields included (e.g. `isAdmin: true`).
- 5. Large payload attacks (report missing size constraints).

## 3. Test Runner
We use ESLint statically instead of firestore emulators for expediency in this environment.
