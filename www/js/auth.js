/**
 * Authentication System for Digital Medication Reminder (DMR) App
 * Handles user authentication including login, signup, and guest mode
 */
class AuthenticationSystem {
    /**
     * Initialize the authentication system
     */
    constructor() {
        // Get base URL for navigation
        this.baseUrl = this.getBaseUrl();
        this.setupEventListeners();
    }

    /**
     * Get the base URL for the application
     * This helps with handling both web and mobile environments
     */
    getBaseUrl() {
        // Get current URL
        const currentUrl = window.location.href;
        // Extract the base part (everything up to the last slash before the file name)
        return currentUrl.substring(0, currentUrl.lastIndexOf('/') + 1);
    }

    /**
     * Set up event listeners for authentication forms and buttons
     */
    setupEventListeners() {
        // Tab switching between login and signup
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
        });

        // Form submissions
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('signupForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSignup();
        });

        // Guest Mode
        document.getElementById('guestModeBtn').addEventListener('click', () => {
            this.handleGuestMode();
        });
    }

    /**
     * Switch between login and signup tabs
     * @param {string} tab - Tab to switch to ('login' or 'signup')
     */
    switchTab(tab) {
        // Update tab active states
        document.querySelectorAll('.auth-tab').forEach(t => {
            t.classList.toggle('active', t.dataset.tab === tab);
        });

        // Update form visibility
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
        });
        document.querySelector(`.auth-form.${tab}`).classList.add('active');
    }

    /**
     * Handle login form submission
     */
    handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        // Basic validation
        if (!email || !password) {
            this.showError('loginEmailError', 'Please fill in all fields');
            return;
        }

        // Simulate login process
        this.simulateAuth('login', { email, password });
    }

    /**
     * Handle signup form submission
     */
    handleSignup() {
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;

        // Basic validation
        if (!name || !email || !password || !confirmPassword) {
            this.showError('signupEmailError', 'Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            this.showError('signupConfirmPasswordError', 'Passwords do not match');
            return;
        }

        // Simulate signup process
        this.simulateAuth('signup', { name, email, password });
    }

    /**
     * Handle guest mode login
     * Creates a limited-access account without requiring login details
     */
    handleGuestMode() {
        const guestUser = {
            id: 'guest_' + Date.now(),
            name: 'Guest User',
            isGuest: true,
            isAuthenticated: true,
            limitations: {
                canExport: false,
                canSync: false,
                maxMedications: 5
            }
        };

        // Add fade-out animation
        document.querySelector('.auth-container').classList.add('fade-out');

        // Save user data and redirect after animation completes
        setTimeout(() => {
            localStorage.setItem('user', JSON.stringify(guestUser));
            window.location.href = this.baseUrl + 'index.html';
        }, 300);
    }

    /**
     * Simulate authentication process
     * @param {string} type - Authentication type ('login' or 'signup')
     * @param {Object} data - User data from the form
     */
    simulateAuth(type, data) {
        // Show loading state
        const button = document.querySelector(`.auth-form.${type} .auth-btn`);
        button.textContent = 'Please wait...';
        button.disabled = true;

        // Simulate server request delay
        setTimeout(() => {
            // Create user object
            const user = {
                id: 'user_' + Date.now(),
                name: type === 'signup' ? data.name : data.email.split('@')[0],
                email: data.email,
                isAuthenticated: true,
                joinDate: new Date().toISOString()
            };

            // Save to localStorage
            localStorage.setItem('user', JSON.stringify(user));

            // Redirect to main application
            window.location.href = this.baseUrl + 'index.html';
        }, 1500);
    }

    /**
     * Show error message
     * @param {string} elementId - ID of element to show error on
     * @param {string} message - Error message to display
     */
    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

/**
 * Initialize authentication system when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    new AuthenticationSystem();
}); 