# 🔥 Firebase Setup Instructions

Follow these steps to set up Firebase authentication for your Classroom Dashboard app.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `classroom-dashboard` (or your choice)
4. Disable Google Analytics (optional)
5. Click **"Create project"**

## Step 2: Register Your Web App

1. In your Firebase project, click the **Web icon** (`</>`)
2. Register app name: `Classroom Dashboard`
3. Click **"Register app"**
4. Copy the `firebaseConfig` object

## Step 3: Enable Authentication

1. In Firebase Console, go to **Authentication** → **Get started**
2. Click **"Sign-in method"** tab
3. Enable these providers:
   - **Email/Password** - Click, toggle enable, save
   - **Google** - Click, toggle enable, add support email, save

## Step 4: Set Up Firestore Database

1. Go to **Firestore Database** → **Create database**
2. Choose **"Start in test mode"** (for development)
3. Select a location (choose closest to you)
4. Click **"Enable"**

## Step 5: Update Your Code

Replace the Firebase config in these files:

### `login.html` (line 104-111)
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### `index.html` (line 104-111)
Same config as above.

## Step 6: Test Your App

1. Open `login.html` in a browser
2. Create a new account
3. You should be redirected to `index.html`
4. Check Firebase Console → Authentication to see your user

## 🔒 Security Rules (Production)

For production, update Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    match /notes/{noteId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.authorId;
    }
  }
}
```

## 📝 User Roles

The app supports two roles:
- **Student** - Can view and create notes
- **Teacher** - Can create lesson posts (future feature)

## 🚀 Next Steps

After authentication is working:
1. Save notes to Firestore
2. Load notes from Firestore
3. Add teacher-only features
4. Add profile pages

## ❓ Troubleshooting

**"Firebase not defined"**
- Make sure you're using a local server (not file://)
- Try: `python3 -m http.server 8000`

**"Auth domain not authorized"**
- Add your domain to Firebase Console → Authentication → Settings → Authorized domains

**"Permission denied"**
- Check Firestore rules
- Make sure user is authenticated
