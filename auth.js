// Authentication Helper Functions
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.6.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.6.1/firebase-firestore.js";

export class AuthManager {
  constructor() {
    this.auth = getAuth();
    this.db = getFirestore();
    this.currentUser = null;
    this.userRole = null;
  }

  // Check if user is authenticated
  async checkAuth() {
    return new Promise((resolve) => {
      onAuthStateChanged(this.auth, async (user) => {
        if (user) {
          // User is signed in
          this.currentUser = user;
          
          // Get user role from Firestore
          try {
            const userDoc = await getDoc(doc(this.db, 'users', user.uid));
            if (userDoc.exists()) {
              this.userRole = userDoc.data().role;
            }
          } catch (error) {
            console.error('Error fetching user role:', error);
          }
          
          resolve(true);
        } else {
          // User is signed out
          this.currentUser = null;
          this.userRole = null;
          resolve(false);
        }
      });
    });
  }

  // Require authentication (redirect to login if not authenticated)
  async requireAuth() {
    const isAuthenticated = await this.checkAuth();
    if (!isAuthenticated) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Get user role
  getUserRole() {
    return this.userRole;
  }

  // Check if user is teacher
  isTeacher() {
    return this.userRole === 'teacher';
  }

  // Check if user is student
  isStudent() {
    return this.userRole === 'student';
  }

  // Sign out
  async logout() {
    try {
      await signOut(this.auth);
      window.location.href = 'login.html';
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Error signing out. Please try again.');
    }
  }

  // Add logout button to navbar
  addLogoutButton(navElement) {
    if (!this.currentUser) return;

    const userName = this.currentUser.displayName || this.currentUser.email;
    const userRole = this.userRole ? `(${this.userRole})` : '';

    const logoutHTML = `
      <div class="ml-auto flex items-center gap-4">
        <span class="text-white text-sm">
          ${userName} ${userRole}
        </span>
        <button id="logout-btn" class="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-all">
          Logout
        </button>
      </div>
    `;

    navElement.insertAdjacentHTML('beforeend', logoutHTML);

    // Add logout event listener
    document.getElementById('logout-btn').addEventListener('click', () => {
      this.logout();
    });
  }
}
