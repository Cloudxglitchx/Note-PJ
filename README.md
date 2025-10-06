# 📚 Classroom Dashboard - Note Sharing Platform

A modern classroom note-sharing platform with Firebase authentication, student/teacher roles, and collaborative learning features.

## ✨ Features

### 🔐 Authentication System
- **Email/Password Login** - Secure account creation
- **Google Sign-In** - One-click authentication
- **Role-Based Access** - Student and Teacher roles
- **Protected Routes** - Login required to access dashboard
- **User Profiles** - Display name and role in navbar

### 📝 Note Sharing
- Teacher lesson overviews with resources
- Student notes with voting system
- Search and filter functionality
- Top notes highlighting
- Resource attachments

### 🎨 Modern UI
- Clean, responsive design with Tailwind CSS
- Smooth animations and transitions
- Mobile-friendly layout
- Professional color scheme

## 🚀 Quick Start (5 Minutes!)

### 1. Set Up Google Sign-In

**👉 Follow:** [QUICKSTART.md](QUICKSTART.md) for step-by-step guide

**TL;DR:**
1. Create Firebase project: https://console.firebase.google.com/
2. Enable Google authentication
3. Copy your Firebase config
4. Paste config in `login.html` and `index.html`
5. Done!

**Need help?** See [GOOGLE_SIGNIN_SETUP.md](GOOGLE_SIGNIN_SETUP.md) for detailed instructions

### 2. Run the App

```bash
# Make the start script executable (first time only)
chmod +x start-server.sh

# Start the local server
./start-server.sh
```

Or manually:
```bash
python3 -m http.server 8000
```

### 3. Open in Browser

Navigate to: **http://localhost:8000/login.html**

## 📁 Project Structure

```
Note PJ/
├── login.html          # Authentication page
├── index.html          # Main dashboard
├── about.html          # About page
├── script.js           # Main app logic
├── auth.js             # Authentication helper
├── styles.css          # Custom styles
├── FIREBASE_SETUP.md   # Firebase setup guide
├── README.md           # This file
└── start-server.sh     # Server startup script
```

## 🔑 User Roles

### Student
- View teacher lessons
- Create and share notes
- Vote on notes
- Search and filter notes

### Teacher
- All student features
- Post lesson overviews (future)
- Manage classroom resources (future)

## 🎯 How to Use

1. **Sign Up**
   - Click "Sign Up" tab
   - Enter your name, email, password
   - Select role (Student or Teacher)
   - Click "Create Account"

2. **Login**
   - Enter email and password
   - Or use "Sign in with Google"
   - You'll be redirected to the dashboard

3. **View Notes**
   - Browse student notes
   - Filter by "Top Today" or "Newest"
   - Search for specific topics

4. **Vote on Notes**
   - Click ↑ to upvote helpful notes
   - Click ↓ to downvote

5. **Logout**
   - Click "Logout" button in navbar

## 🛠️ Technologies

- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript
- **Backend**: Firebase Authentication, Firestore
- **Icons**: Custom SVG icons
- **Fonts**: Google Fonts (Inter)

## 🔮 Future Features

- [ ] Create new notes (student)
- [ ] Post lessons (teacher only)
- [ ] Comments on notes
- [ ] File uploads (PDFs, images)
- [ ] Categories/tags
- [ ] Notifications
- [ ] User profiles
- [ ] Dark mode
- [ ] Real-time updates

## 🐛 Troubleshooting

**"Firebase not defined"**
- Use a local server, not file:// protocol
- Run `python3 -m http.server 8000`

**"Not redirecting after login"**
- Check Firebase config is correct
- Check browser console for errors

**"Can't create account"**
- Ensure Email/Password is enabled in Firebase
- Password must be 6+ characters

## 📝 License

MIT License - Feel free to use for educational purposes

## 🤝 Contributing

This is a student project. Feel free to fork and improve!

## 📧 Support

For Firebase setup help, see [FIREBASE_SETUP.md](FIREBASE_SETUP.md)

---

Built with ❤️ for collaborative learning
