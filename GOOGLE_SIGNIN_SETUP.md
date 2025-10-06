# 🔐 Google Sign-In Setup (5 Minutes)

Follow these simple steps to enable Google Sign-In for your Classroom Dashboard.

## Step 1: Create Firebase Project (2 min)

1. Go to **https://console.firebase.google.com/**
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `classroom-notes` (or anything you want)
4. **Disable** Google Analytics (uncheck the box) - you don't need it
5. Click **"Create project"**
6. Wait for it to finish, then click **"Continue"**

## Step 2: Register Your Web App (1 min)

1. On the project homepage, click the **Web icon** `</>`
2. App nickname: `Classroom Dashboard`
3. **Don't** check "Firebase Hosting"
4. Click **"Register app"**
5. You'll see a `firebaseConfig` object - **COPY IT!**

It looks like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "classroom-notes-abc123.firebaseapp.com",
  projectId: "classroom-notes-abc123",
  storageBucket: "classroom-notes-abc123.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};
```

## Step 3: Enable Google Sign-In (1 min)

1. In the left sidebar, click **"Authentication"**
2. Click **"Get started"**
3. Click the **"Sign-in method"** tab
4. Click on **"Google"**
5. Toggle the **Enable** switch
6. Select your email from the dropdown (Project support email)
7. Click **"Save"**

## Step 4: Enable Firestore (1 min)

1. In the left sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. Select **"Start in test mode"** (for development)
4. Click **"Next"**
5. Choose a location (pick the one closest to you)
6. Click **"Enable"**

## Step 5: Update Your Code (30 seconds)

1. Open `login.html` in your code editor
2. Find line 144-151 (the `firebaseConfig` section)
3. **Replace** the placeholder config with YOUR config from Step 2
4. Save the file

**Before:**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  // ...
};
```

**After (with YOUR values):**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC_YOUR_ACTUAL_KEY_HERE",
  authDomain: "classroom-notes-abc123.firebaseapp.com",
  projectId: "classroom-notes-abc123",
  storageBucket: "classroom-notes-abc123.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};
```

5. Do the same in `index.html` (line 104-111)

## Step 6: Test It! 🎉

1. Start your local server:
   ```bash
   cd "/Users/warrenanderson/GitHub/Note PJ"
   ./start-server.sh
   ```

2. Open browser: **http://localhost:8000/login.html**

3. Click **"Sign in with Google"**

4. Choose your Google account

5. You should be redirected to the dashboard!

## ✅ That's It!

Your app now has Google Sign-In working! Users can:
- Sign in with their Google account
- Access the dashboard
- See their name in the navbar
- Logout

## 🐛 Troubleshooting

**"Firebase not defined"**
- Make sure you're using `http://localhost:8000` not `file://`
- Run the server with `./start-server.sh`

**"This domain is not authorized"**
- In Firebase Console → Authentication → Settings → Authorized domains
- Add `localhost` (it should already be there)

**"Popup closed by user"**
- Just try clicking "Sign in with Google" again

**Still not working?**
- Check browser console (F12) for errors
- Make sure you copied the ENTIRE firebaseConfig
- Make sure Google sign-in is enabled in Firebase Console

## 🎯 Next Steps

Once Google Sign-In works:
1. Add email/password as backup option
2. Save user notes to Firestore
3. Add teacher-only features
4. Deploy to the web!

---

Need help? Check the browser console (F12) for error messages.
