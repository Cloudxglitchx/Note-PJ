# 🚀 Quick Start - Get Google Sign-In Working in 5 Minutes!

## What You Need
- A Google account
- 5 minutes

## Step-by-Step Guide

### 1️⃣ Create Firebase Project
👉 **Open this link:** https://console.firebase.google.com/

- Click **"Add project"**
- Name it: `classroom-notes`
- **Uncheck** Google Analytics
- Click **"Create project"**

### 2️⃣ Add Web App
- Click the **`</>`** (web) icon
- Nickname: `Classroom Dashboard`
- Click **"Register app"**
- **COPY the firebaseConfig code** (you'll need this!)

### 3️⃣ Enable Google Sign-In
- Click **"Authentication"** in sidebar
- Click **"Get started"**
- Click **"Sign-in method"** tab
- Click **"Google"**
- Toggle **Enable**
- Select your email
- Click **"Save"**

### 4️⃣ Enable Firestore
- Click **"Firestore Database"** in sidebar
- Click **"Create database"**
- Choose **"Start in test mode"**
- Click **"Next"** → **"Enable"**

### 5️⃣ Update Your Code

**Open these 2 files and paste your Firebase config:**

1. **`login.html`** - Find line 144, replace the config
2. **`index.html`** - Find line 105, replace the config

Replace this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  // ...
};
```

With YOUR config from Step 2!

### 6️⃣ Start the Server

```bash
cd "/Users/warrenanderson/GitHub/Note PJ"
./start-server.sh
```

### 7️⃣ Test It!

Open: **http://localhost:8000/login.html**

Click **"Sign in with Google"** → Choose your account → Done! 🎉

---

## 📝 Full Details

See [GOOGLE_SIGNIN_SETUP.md](GOOGLE_SIGNIN_SETUP.md) for detailed instructions with screenshots.

## ❓ Having Issues?

1. Make sure you're using `http://localhost:8000` (not file://)
2. Check that you copied the ENTIRE firebaseConfig
3. Press F12 to see browser console errors
4. Make sure Google sign-in is enabled in Firebase Console

## ✅ Once It Works

You can:
- ✅ Sign in with Google
- ✅ See your name in the navbar
- ✅ Access the dashboard
- ✅ Logout

Next: Save notes to Firestore, add more features!
