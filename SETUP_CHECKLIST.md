# ✅ Setup Checklist - Google Sign-In

Use this checklist to set up Google authentication for your Classroom Dashboard.

## 📋 Pre-Setup
- [ ] I have a Google account
- [ ] I have 5 minutes
- [ ] I'm ready to enable Google Sign-In!

## 🔥 Firebase Setup

### Step 1: Create Project
- [ ] Go to https://console.firebase.google.com/
- [ ] Click "Add project"
- [ ] Enter project name: `classroom-notes`
- [ ] Disable Google Analytics (uncheck box)
- [ ] Click "Create project"
- [ ] Wait for completion, click "Continue"

### Step 2: Register Web App
- [ ] Click the `</>` web icon
- [ ] Enter nickname: `Classroom Dashboard`
- [ ] Click "Register app"
- [ ] **COPY the entire firebaseConfig object**
- [ ] Save it somewhere (you'll paste it in your code)

### Step 3: Enable Google Sign-In
- [ ] Click "Authentication" in left sidebar
- [ ] Click "Get started"
- [ ] Click "Sign-in method" tab
- [ ] Click "Google" provider
- [ ] Toggle "Enable" switch ON
- [ ] Select your email from dropdown
- [ ] Click "Save"

### Step 4: Enable Firestore
- [ ] Click "Firestore Database" in left sidebar
- [ ] Click "Create database"
- [ ] Select "Start in test mode"
- [ ] Click "Next"
- [ ] Choose closest location
- [ ] Click "Enable"
- [ ] Wait for database creation

## 💻 Code Updates

### Update login.html
- [ ] Open `login.html` in code editor
- [ ] Find line 144 (the firebaseConfig section)
- [ ] Replace placeholder config with YOUR config
- [ ] Save file

### Update index.html
- [ ] Open `index.html` in code editor
- [ ] Find line 105 (the firebaseConfig section)
- [ ] Replace placeholder config with YOUR config
- [ ] Save file

## 🚀 Testing

### Start Server
- [ ] Open terminal
- [ ] Navigate to project folder
- [ ] Run: `./start-server.sh`
- [ ] Server starts on port 8000

### Test Login
- [ ] Open browser
- [ ] Go to: http://localhost:8000/login.html
- [ ] Click "Sign in with Google"
- [ ] Choose your Google account
- [ ] Grant permissions
- [ ] Should redirect to dashboard
- [ ] See your name in navbar
- [ ] Click "Logout" to test logout

## ✅ Success Criteria

You know it's working when:
- ✅ Google Sign-In popup appears
- ✅ You can select your Google account
- ✅ You're redirected to index.html
- ✅ Your name appears in the navbar
- ✅ Logout button works

## 🐛 Troubleshooting

If something doesn't work:
- [ ] Check browser console (F12) for errors
- [ ] Verify you're using http://localhost:8000 (not file://)
- [ ] Confirm Google sign-in is enabled in Firebase Console
- [ ] Make sure you copied the ENTIRE firebaseConfig
- [ ] Try refreshing the page
- [ ] Clear browser cache and try again

## 📚 Resources

- **Quick Guide**: [QUICKSTART.md](QUICKSTART.md)
- **Detailed Guide**: [GOOGLE_SIGNIN_SETUP.md](GOOGLE_SIGNIN_SETUP.md)
- **Full README**: [README.md](README.md)

---

## 🎉 All Done?

Congratulations! Your app now has Google Sign-In! 

### What's Next?
- [ ] Add ability to create notes
- [ ] Save notes to Firestore
- [ ] Add teacher-only features
- [ ] Deploy to the web
- [ ] Share with classmates!

---

**Need Help?** Check the detailed guides or look at browser console errors (F12).
