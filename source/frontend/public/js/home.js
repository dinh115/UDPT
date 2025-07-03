// Enhanced functionality for medical dashboard
class MedicalDashboard {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startRealTimeUpdates();
        this.initializeAnimations();
    }

    setupEventListeners() {
        // Refresh buttons
        const refreshButtons = document.querySelectorAll('.refresh-btn');
        refreshButtons.forEach(btn => {
            btn.addEventListener('click', () => this.refreshData());
        });

        // Quick action buttons
        const actionButtons = document.querySelectorAll('.action-btn');
        actionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleQuickAction(e.target.closest('.action-btn'));
            });
        });
    }

    async refreshData() {
        try {
            // Show loading states
            this.showLoading();

            // Simulate API calls - replace with actual endpoints
            const [patients, records] = await Promise.all([
                this.fetchPatients(),
                this.fetchRecords()
            ]);

            // Update UI
            this.updatePatientsList(patients);
            this.updateRecordsList(records);

            // Hide loading states
            this.hideLoading();

            // Show success message
            this.showNotification('Data refreshed successfully!', 'success');

        } catch (error) {
            this.hideLoading();
            this.showError('Failed to refresh data: ' + error.message);
        }
    }

    async fetchPatients() {
        // Replace with actual API call
        const response = await fetch('/users/api');
        const result = await response.json();

        if (result.success) {
            return result.data;
        } else {
            throw new Error(result.error);
        }
    }

    async fetchRecords() {
        // Replace with actual API call
        const response = await fetch('/records/api');
        const result = await response.json();

        if (result.success) {
            return result.data;
        } else {
            throw new Error(result.error);
        }
    }

    updatePatientsList(patients) {
        const container = document.getElementById('patients-container');
        if (!container || !patients) return;

        container.innerHTML = patients.slice(0, 5).map(patient => `
                    <div class="user-card">
                        <div class="user-name">
                            <i class="fas fa-user-circle me-2 text-primary"></i>
                            ${this.escapeHtml(patient.name || 'N/A')}
                        </div>
                        <div class="user-email">${this.escapeHtml(patient.email || 'N/A')}</div>
                        <small class="text-muted">
                            <i class="fas fa-phone me-1"></i>
                            ${this.escapeHtml(patient.phone || 'N/A')}
                        </small>
                    </div>
                `).join('');
    }

    updateRecordsList(records) {
        const container = document.getElementById('records-container');
        if (!container || !records) return;

        container.innerHTML = records.slice(0, 5).map(record => `
                    <div class="post-card">
                        <div class="post-title">
                            <i class="fas fa-file-medical me-2 text-info"></i>
                            ${this.escapeHtml(record.title || 'Medical Record')}
                        </div>
                        <div class="post-excerpt">
                            ${this.escapeHtml(record.body ? record.body.substring(0, 100) + '...' : 'No description available')}
                        </div>
                        <small class="text-muted">
                            <i class="fas fa-clock me-1"></i>
                            Patient ID: ${this.escapeHtml(record.userId || 'N/A')}
                        </small>
                    </div>
                `).join('');
    }

    showLoading() {
        const loadingElements = document.querySelectorAll('[id$="-loading"]');
        loadingElements.forEach(el => el.style.display = 'block');
    }

    hideLoading() {
        const loadingElements = document.querySelectorAll('[id$="-loading"]');
        loadingElements.forEach(el => el.style.display = 'none');
    }

    showError(message) {
        const errorElements = document.querySelectorAll('[id$="-error"]');
        errorElements.forEach(el => {
            el.textContent = message;
            el.style.display = 'block';
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
                    <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'} me-2"></i>
                    ${message}
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                `;

        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    handleQuickAction(button) {
        // Add loading state to button
        const originalText = button.innerHTML;
        button.innerHTML = '<div class="loading"></div> Processing...';
        button.style.pointerEvents = 'none';

        // Reset button after 2 seconds (simulate action)
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.pointerEvents = 'auto';
        }, 2000);
    }

    startRealTimeUpdates() {
        // Update stats every 30 seconds
        setInterval(() => {
            this.updateStats();
        }, 30000);
    }

    updateStats() {
        // Simulate real-time stat updates
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            const currentValue = parseInt(stat.textContent);
            const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
            const newValue = Math.max(0, currentValue + change);

            if (newValue !== currentValue) {
                stat.textContent = newValue;
                stat.parentElement.classList.add('pulse');
                setTimeout(() => {
                    stat.parentElement.classList.remove('pulse');
                }, 2000);
            }
        });
    }

    initializeAnimations() {
        // Add staggered animations to cards
        const cards = document.querySelectorAll('.dashboard-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('animate-card');
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MedicalDashboard();
});

// Add CSS animation class
const style = document.createElement('style');
style.textContent = `
            .animate-card {
                animation: slideInUp 0.6s ease-out both;
            }
            
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(50px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
document.head.appendChild(style);