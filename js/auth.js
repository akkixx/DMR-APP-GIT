class AuthenticationSystem {
    constructor() {
        this.setupEventListeners();
        this.checkExistingAuth();
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
        });

        // Form submissions
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignup();
            });
        }

        // Guest Mode
        const guestModeBtn = document.getElementById('guestModeBtn');
        if (guestModeBtn) {
            guestModeBtn.addEventListener('click', () => {
                this.handleGuestMode();
            });
        }
    }

    checkExistingAuth() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.isAuthenticated) {
            window.location.href = 'index.html';
        }
    }

    switchTab(tab) {
        document.querySelectorAll('.auth-tab').forEach(t => {
            t.classList.toggle('active', t.dataset.tab === tab);
        });

        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.toggle('active', form.id === `${tab}Form`);
        });
    }

    handleLogin() {
        const email = document.querySelector('#loginForm input[type="email"]').value;
        const password = document.querySelector('#loginForm input[type="password"]').value;

        // For demo purposes, accept any valid email/password
        if (email && password) {
            const user = {
                name: email.split('@')[0],
                email: email,
                isAuthenticated: true,
                joinDate: new Date().toISOString()
            };

            localStorage.setItem('user', JSON.stringify(user));
            
            // Initialize default medication data
            if (!localStorage.getItem('dmrData')) {
                const defaultData = {
                    medications: [],
                    history: [],
                    currentUser: user
                };
                localStorage.setItem('dmrData', JSON.stringify(defaultData));
            }

            window.location.href = 'index.html';
        } else {
            this.showError('Please fill in all fields');
        }
    }

    handleSignup() {
        const name = document.querySelector('#signupForm input[name="name"]').value;
        const email = document.querySelector('#signupForm input[type="email"]').value;
        const password = document.querySelector('#signupForm input[type="password"]').value;

        if (name && email && password) {
            const user = {
                name: name,
                email: email,
                isAuthenticated: true,
                joinDate: new Date().toISOString()
            };

            localStorage.setItem('user', JSON.stringify(user));
            
            // Initialize default medication data
            const defaultData = {
                medications: [],
                history: [],
                currentUser: user
            };
            localStorage.setItem('dmrData', JSON.stringify(defaultData));

            window.location.href = 'index.html';
        } else {
            this.showError('Please fill in all fields');
        }
    }

    handleGuestMode() {
        const guestUser = {
            name: 'Guest User',
            email: 'guest@example.com',
            isAuthenticated: true,
            isGuest: true,
            joinDate: new Date().toISOString()
        };

        localStorage.setItem('user', JSON.stringify(guestUser));
        
        // Initialize guest data with sample medications
        const guestData = {
            medications: [],
            history: [],
            currentUser: guestUser
        };
        localStorage.setItem('dmrData', JSON.stringify(guestData));

        window.location.href = 'index.html';
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'auth-error';
        errorDiv.textContent = message;
        
        // Remove any existing error
        const existingError = document.querySelector('.auth-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const activeForm = document.querySelector('.auth-form.active');
        if (activeForm) {
            activeForm.insertBefore(errorDiv, activeForm.firstChild);
        }
        
        // Remove error after 3 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }
}

// Initialize authentication
document.addEventListener('DOMContentLoaded', () => {
    new AuthenticationSystem();
}); 