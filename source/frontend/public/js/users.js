// Dynamic user loading
class UserManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Refresh users button
        const refreshBtn = document.querySelector('.btn-refresh');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshUsers());
        }

        // Search functionality
        const searchInput = document.querySelector('#user-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchUsers(e.target.value);
            });
        }
    }

    async refreshUsers() {
        try {
            const response = await fetch('/users/api');
            const result = await response.json();

            if (result.success) {
                this.updateUsersList(result.data);
            } else {
                this.showError(result.error);
            }
        } catch (error) {
            this.showError('Failed to refresh users');
        }
    }

    updateUsersList(users) {
        const container = document.querySelector('.users-grid');
        if (!container) return;

        container.innerHTML = users.map(user => `
            <div class="user-card">
                <h3>${this.escapeHtml(user.name || 'N/A')}</h3>
                <p>Email: ${this.escapeHtml(user.email || 'N/A')}</p>
                <p>Phone: ${this.escapeHtml(user.phone || 'N/A')}</p>
                <div class="actions">
                    <a href="/users/show/${user.id}" class="btn btn-small">View</a>
                    <a href="/users/edit/${user.id}" class="btn btn-small">Edit</a>
                </div>
            </div>
        `).join('');
    }

    showError(message) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-error';
        alert.innerHTML = `<p>Error: ${this.escapeHtml(message)}</p>`;

        const container = document.querySelector('.container');
        container.insertBefore(alert, container.firstChild);

        setTimeout(() => alert.remove(), 5000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new UserManager();
});