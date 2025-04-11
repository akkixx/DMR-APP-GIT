/**
 * Main Application Class
 * Controls the core functionality of the Digital Medication Reminder app
 */
class App {
    /**
     * Initialize the application with default state
     */
    constructor() {
        this.currentView = 'home';  // Default view
        this.views = new Map();     // Store rendered views for caching
        this.medications = [];      // User's medication list
        this.baseUrl = this.getBaseUrl(); // Get the base URL for navigation
        this.init();                // Start app initialization
    }

    /**
     * Initialize the application
     * Handles authentication, data loading, and UI setup
     */
    async init() {
        try {
            await this.checkAuth();          // Verify user is authenticated
            await this.loadMedications();    // Load medication data
            this.setupEventListeners();      // Set up UI interactions
            this.renderView(this.currentView); // Show initial view
        } catch (error) {
            console.error('Initialization error:', error);
            this.showError('Failed to initialize app. Please try again.');
        }
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
     * Load medication data from local storage
     */
    async loadMedications() {
        const stored = localStorage.getItem('medications');
        this.medications = stored ? JSON.parse(stored) : [];
    }

    /**
     * Check if user is authenticated
     * Redirects to auth page if not logged in
     */
    async checkAuth() {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (!user?.isAuthenticated) {
            window.location.href = this.baseUrl + 'auth.html';
            throw new Error('Not authenticated');
        }
    }

    /**
     * Set up all event listeners for the application
     */
    setupEventListeners() {
        // Navigation tabs
        document.querySelectorAll('.nav-item').forEach(item => 
            item.addEventListener('click', e => {
                e.preventDefault();
                this.switchView(item.dataset.view);
            })
        );

        // Profile sidebar
        const elements = {
            profile: document.getElementById('profileBtn'),
            sidebar: document.getElementById('profileSidebar'),
            overlay: document.getElementById('overlay'),
            close: document.getElementById('closeProfile'),
            logout: document.getElementById('logoutBtn')
        };

        // Toggle profile sidebar visibility
        const toggleProfile = (show) => {
            elements.sidebar.classList.toggle('active', show);
            elements.overlay.classList.toggle('active', show);
        };

        // Attach profile-related event handlers
        elements.profile.onclick = () => toggleProfile(true);
        elements.close.onclick = () => toggleProfile(false);
        elements.overlay.onclick = () => toggleProfile(false);
        elements.logout.onclick = () => this.handleLogout();
    }

    /**
     * Get content for the specified view
     * @param {string} view - View name to render (home, meds, settings)
     * @returns {string} HTML content for the view
     */
    getViewContent(view) {
        switch (view) {
            case 'home':
                return this.getHomeView();
            case 'meds':
                return this.getMedicationsView();
            case 'settings':
                return this.getSettingsView();
            default:
                return '<div class="error">View not found</div>';
        }
    }

    /**
     * Generate HTML for the home view
     * Shows today's medications
     */
    getHomeView() {
        const today = new Date().toLocaleDateString();
        const todaysMeds = this.medications.filter(med => this.isMedicationDueToday(med));
        
        return `
            <div class="section">
                <div class="section-header">
                    <h2 class="section-title">Today's Medications (${today})</h2>
                </div>
                <div class="medication-list">
                    ${todaysMeds.length ? todaysMeds.map(med => this.renderMedicationCard(med)).join('') 
                        : '<div class="empty-state">No medications scheduled for today</div>'}
                </div>
            </div>
        `;
    }

    /**
     * Generate HTML for the medications view
     * Shows all medications with option to add new ones
     */
    getMedicationsView() {
        return `
            <div class="section">
                <div class="section-header">
                    <h2 class="section-title">All Medications</h2>
                    <button class="add-med-btn" onclick="app.showAddMedicationForm()">
                        <span>+</span> Add New
                    </button>
                </div>
                <div class="medication-list">
                    ${this.medications.length ? this.medications.map(med => this.renderMedicationCard(med)).join('')
                        : '<div class="empty-state">No medications added yet</div>'}
                </div>
            </div>
        `;
    }

    /**
     * Generate HTML for the settings view
     */
    getSettingsView() {
        return `
            <div class="section">
                <h2 class="section-title">Settings</h2>
                <div class="settings-list">
                    <div class="setting-item">
                        <label>Notification Sound</label>
                        <select id="notificationSound">
                            <option value="default">Default</option>
                            <option value="bell">Bell</option>
                            <option value="chime">Chime</option>
                        </select>
                    </div>
                    <div class="setting-item">
                        <label>Dark Mode</label>
                        <input type="checkbox" id="darkMode">
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Create HTML for a medication card
     * @param {Object} med - Medication object
     * @returns {string} HTML for the medication card
     */
    renderMedicationCard(med) {
        return `
            <div class="medication-card" data-id="${med.id}">
                <div class="med-info">
                    <div class="med-icon">💊</div>
                    <div class="med-details">
                        <h3>${med.name}</h3>
                        <p>${med.dosage} - ${med.frequency}</p>
                    </div>
                </div>
                <button class="confirm-btn" onclick="app.markMedicationTaken(${med.id})">
                    Take
                </button>
            </div>
        `;
    }

    /**
     * Check if medication is due today based on its schedule
     * @param {Object} med - Medication object
     * @returns {boolean} True if medication is due today
     */
    isMedicationDueToday(med) {
        // TODO: Implement proper schedule checking logic
        return true; // Currently showing all medications
    }

    /**
     * Display modal form to add a new medication
     */
    showAddMedicationForm() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Add New Medication</h2>
                <form id="addMedForm">
                    <input type="text" placeholder="Medication Name" required>
                    <input type="text" placeholder="Dosage" required>
                    <select required>
                        <option value="">Select Frequency</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                    <div class="button-group">
                        <button type="submit">Add</button>
                        <button type="button" onclick="this.closest('.modal').remove()">Cancel</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
    }

    /**
     * Mark a medication as taken
     * @param {string} medId - ID of the medication
     */
    markMedicationTaken(medId) {
        // TODO: Implement medication tracking
        this.showSuccess('Medication marked as taken!');
    }

    /**
     * Show a success message toast
     * @param {string} message - Success message to display
     */
    showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        document.body.appendChild(successDiv);
        setTimeout(() => successDiv.remove(), 3000);
    }

    /**
     * Switch to a different view
     * @param {string} view - Name of the view to switch to
     */
    switchView(view) {
        if (!view || view === this.currentView) return;
        
        // Update navigation UI
        document.querySelectorAll('.nav-item').forEach(item => 
            item.classList.toggle('active', item.dataset.view === view)
        );

        this.currentView = view;
        this.renderView(view);
    }

    /**
     * Render a view to the main content area
     * @param {string} view - Name of the view to render
     */
    renderView(view) {
        const contentElement = document.querySelector('.content');
        if (!contentElement) return;

        // Get or create view content
        if (!this.views.has(view)) {
            this.views.set(view, this.getViewContent(view));
        }
        
        contentElement.innerHTML = this.views.get(view);
        this.setupViewHandlers(view);
    }

    /**
     * Set up event handlers specific to each view
     * @param {string} view - The current view
     */
    setupViewHandlers(view) {
        // Add view-specific event handlers here
        if (view === 'settings') {
            const darkModeToggle = document.getElementById('darkMode');
            if (darkModeToggle) {
                darkModeToggle.checked = document.body.classList.contains('dark-mode');
                darkModeToggle.addEventListener('change', e => {
                    document.body.classList.toggle('dark-mode', e.target.checked);
                });
            }
        }
    }

    /**
     * Handle user logout
     */
    handleLogout() {
        localStorage.removeItem('user');
        window.location.href = this.baseUrl + 'auth.html';
    }

    /**
     * Show an error message toast
     * @param {string} message - Error message to display
     */
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 3000);
    }
}

// Initialize the app when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
}); 