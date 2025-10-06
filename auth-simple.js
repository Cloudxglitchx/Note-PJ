// Simple Authentication (No Firebase Required!)
// Uses localStorage to store user sessions

export class SimpleAuth {
  constructor() {
    this.currentUser = null;
    this.loadCurrentUser();
  }

  // Load current user from localStorage
  loadCurrentUser() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUser = JSON.parse(userData);
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.currentUser !== null;
  }

  // Require authentication (redirect to login if not authenticated)
  requireAuth() {
    if (!this.isAuthenticated()) {
      window.location.href = 'login-simple.html';
      return false;
    }
    return true;
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Get user name
  getUserName() {
    return this.currentUser ? this.currentUser.name : null;
  }

  // Get user email
  getUserEmail() {
    return this.currentUser ? this.currentUser.email : null;
  }

  // Get user role
  getUserRole() {
    return this.currentUser ? this.currentUser.role : null;
  }

  // Check if user is teacher
  isTeacher() {
    return this.getUserRole() === 'teacher';
  }

  // Check if user is student
  isStudent() {
    return this.getUserRole() === 'student';
  }

  // Sign out
  logout() {
    localStorage.removeItem('currentUser');
    this.currentUser = null;
    window.location.href = 'login-simple.html';
  }

  // Add logout button to navbar
  addLogoutButton(navElement) {
    if (!this.currentUser) return;

    const userName = this.currentUser.name;
    const userRole = this.currentUser.role;

    const logoutHTML = `
      <div class="ml-auto flex items-center gap-4">
        <span class="text-white text-sm">
          ${userName} <span class="opacity-75">(${userRole})</span>
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
