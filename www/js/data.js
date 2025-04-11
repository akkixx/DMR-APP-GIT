/**
 * MedicationData Module
 * Contains sample data and data management functionality for medications
 */
const MedicationData = {
    /**
     * Sample user profile data
     */
    currentUser: {
        id: 'user123',
        name: "John's Profile",
        email: 'john@example.com',
        joinDate: '2024-05-01',
        avatar: '👤',
        settings: {
            darkMode: false,
            notifications: true,
            smsAlerts: false,
            timezone: 'America/New_York',
            sound: true
        }
    },

    /**
     * Sample medication data for demonstration
     * Each medication has unique properties and scheduling information
     */
    medications: [
        {
            id: '1',
            name: 'Aspirin',
            dosage: {
                amount: 1,
                unit: 'tablet'
            },
            time: '8:00 AM',
            status: 'pending',
            stockCount: 15,
            lowStockThreshold: 5,
            nextDose: new Date().setHours(8, 0, 0, 0),
            withFood: true,
            important: true,
            description: 'Take with water',
            color: '#FF6B6B'
        },
        {
            id: '2',
            name: 'Metformin',
            dosage: {
                amount: 1,
                unit: 'tablet'
            },
            time: '9:00 AM',
            status: 'upcoming',
            stockCount: 20,
            lowStockThreshold: 5,
            nextDose: new Date().setHours(9, 0, 0, 0),
            withFood: true,
            important: true,
            description: 'Take with breakfast',
            color: '#4ECDC4'
        },
        {
            id: '3',
            name: 'Lipitor',
            dosage: {
                amount: 1,
                unit: 'tablet'
            },
            time: '10:00 AM',
            status: 'upcoming',
            stockCount: 2,
            lowStockThreshold: 5,
            nextDose: new Date().setHours(10, 0, 0, 0),
            withFood: false,
            important: true,
            description: 'Take on empty stomach',
            color: '#45B7D1'
        },
        {
            id: '4',
            name: 'Vitamin D3',
            dosage: {
                amount: 1,
                unit: 'tablet'
            },
            time: '11:00 AM',
            status: 'upcoming',
            stockCount: 30,
            lowStockThreshold: 5,
            nextDose: new Date().setHours(11, 0, 0, 0),
            withFood: true,
            important: false,
            description: 'Take with fatty meal',
            color: '#96CEB4'
        },
        {
            id: '5',
            name: 'Omega-3',
            dosage: {
                amount: 2,
                unit: 'capsules'
            },
            time: '1:00 PM',
            status: 'upcoming',
            stockCount: 45,
            lowStockThreshold: 10,
            nextDose: new Date().setHours(13, 0, 0, 0),
            withFood: true,
            important: false,
            description: 'Take with lunch',
            color: '#FFD93D'
        },
        {
            id: '6',
            name: 'Calcium',
            dosage: {
                amount: 1,
                unit: 'tablet'
            },
            time: '3:00 PM',
            status: 'upcoming',
            stockCount: 8,
            lowStockThreshold: 5,
            nextDose: new Date().setHours(15, 0, 0, 0),
            withFood: false,
            important: false,
            description: 'Take between meals',
            color: '#FF8B94'
        },
        {
            id: '7',
            name: 'Zinc',
            dosage: {
                amount: 1,
                unit: 'tablet'
            },
            time: '4:00 PM',
            status: 'upcoming',
            stockCount: 12,
            lowStockThreshold: 5,
            nextDose: new Date().setHours(16, 0, 0, 0),
            withFood: false,
            important: false,
            description: 'Take on empty stomach',
            color: '#98B4D4'
        },
        {
            id: '8',
            name: 'Magnesium',
            dosage: {
                amount: 1,
                unit: 'tablet'
            },
            time: '8:00 PM',
            status: 'upcoming',
            stockCount: 25,
            lowStockThreshold: 5,
            nextDose: new Date().setHours(20, 0, 0, 0),
            withFood: false,
            important: false,
            description: 'Take before bed',
            color: '#9B5DE5'
        }
    ],

    /** 
     * Medication history tracking
     * Stores a record of when medications were taken
     */
    medicationHistory: [],

    /**
     * Sample user profiles
     * Can be used for multi-user functionality
     */
    profiles: [
        {
            id: 'john123',
            name: "John's Profile",
            isCaregiver: false,
            linkedProfiles: [],
            settings: {
                darkMode: false,
                offlineMode: false,
                accessibility: {
                    fontSize: 'normal',
                    highContrast: false,
                    soundEnabled: true
                }
            }
        }
    ],

    /**
     * Save all data to local storage
     */
    saveToStorage() {
        localStorage.setItem('dmrData', JSON.stringify({
            medications: this.medications,
            history: this.medicationHistory,
            currentUser: this.currentUser
        }));
    },

    /**
     * Load data from local storage
     */
    loadFromStorage() {
        const stored = localStorage.getItem('dmrData');
        if (stored) {
            const data = JSON.parse(stored);
            this.medications = data.medications;
            this.medicationHistory = data.history;
            this.currentUser = data.currentUser;
        }
    },

    /**
     * Add a medication event to history
     * @param {Object} medication - The medication that was taken
     * @param {string} action - The action performed (taken, skipped, etc.)
     */
    addToHistory(medication, action) {
        this.medicationHistory.unshift({
            ...medication,
            action,
            timestamp: new Date().toISOString()
        });
        this.saveToStorage();
    },

    /**
     * Update a medication's status
     * @param {string} id - ID of the medication to update
     * @param {string} status - New status to set
     */
    updateMedicationStatus(id, status) {
        const medication = this.medications.find(med => med.id === id);
        if (medication) {
            medication.status = status;
            
            if (status === 'taken') {
                this.addToHistory(medication, 'taken');
                
                // Schedule next dose based on frequency
                const nextDose = new Date();
                nextDose.setDate(nextDose.getDate() + 1); // Default to next day
                nextDose.setHours(
                    new Date(medication.nextDose).getHours(),
                    new Date(medication.nextDose).getMinutes(),
                    0, 0
                );
                medication.nextDose = nextDose.getTime();
            }
            
            this.saveToStorage();
        }
    },

    /**
     * Reset medication statuses for a new day
     */
    resetDailyMedications() {
        const now = new Date();
        const today = now.toDateString();
        
        this.medications.forEach(med => {
            const medDate = new Date(med.nextDose).toDateString();
            if (medDate === today) {
                med.status = 'pending';
            }
        });
        
        this.saveToStorage();
    },

    /**
     * Add a new medication to the list
     * @param {Object} medication - New medication to add
     */
    addMedication(medication) {
        // Generate a unique ID
        medication.id = Date.now().toString();
        
        // Set defaults if not provided
        medication.status = medication.status || 'pending';
        medication.color = medication.color || this.getRandomColor();
        
        this.medications.push(medication);
        this.saveToStorage();
        return medication;
    },

    /**
     * Delete a medication from the list
     * @param {string} id - ID of medication to delete
     */
    deleteMedication(id) {
        const index = this.medications.findIndex(med => med.id === id);
        if (index !== -1) {
            this.medications.splice(index, 1);
            this.saveToStorage();
            return true;
        }
        return false;
    },

    /**
     * Generate a random color for medication
     * @returns {string} A hexadecimal color code
     */
    getRandomColor() {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
            '#FFD93D', '#FF8B94', '#98B4D4', '#9B5DE5'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    },

    /**
     * Initialize the data module
     */
    init() {
        this.loadFromStorage();
        
        // Reset medications status at start of day
        const lastReset = localStorage.getItem('lastReset');
        const today = new Date().toDateString();
        
        if (lastReset !== today) {
            this.resetDailyMedications();
            localStorage.setItem('lastReset', today);
        }
    }
};

// Initialize data when script loads
MedicationData.init();

// Data structure for a medication
const MedicationSchema = {
    id: String,
    name: String,
    dosage: {
        amount: Number,
        unit: String
    },
    schedule: {
        frequency: String, // daily/weekly/as-needed
        times: Array,
        daysOfWeek: Array // for weekly medications
    },
    stockCount: Number,
    lowStockThreshold: Number,
    profileId: String
};

// Data structure for a profile
const ProfileSchema = {
    id: String,
    name: String,
    isCaregiver: Boolean,
    linkedProfiles: Array
}; 