// Patient-specific JavaScript functionality
class PatientManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadPatientData();
    }

    bindEvents() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(this.filterTable.bind(this), 300));
        }

        // Filter dropdowns
        const departmentFilter = document.getElementById('departmentFilter');
        const dateFilter = document.getElementById('dateFilter');
        
        if (departmentFilter) {
            departmentFilter.addEventListener('change', this.filterTable.bind(this));
        }
        
        if (dateFilter) {
            dateFilter.addEventListener('change', this.filterTable.bind(this));
        }

        // Clear filters button
        const clearFilter = document.getElementById('clearFilter');
        if (clearFilter) {
            clearFilter.addEventListener('click', this.clearFilters.bind(this));
        }

        // Print functionality
        const printBtn = document.querySelector('.print-btn');
        if (printBtn) {
            printBtn.addEventListener('click', this.printPage.bind(this));
        }

        // Visit history row click
        const visitRows = document.querySelectorAll('.visit-history-row');
        visitRows.forEach(row => {
            row.addEventListener('click', this.handleVisitRowClick.bind(this));
        });

        // Load more button
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', this.loadMoreVisits.bind(this));
        }
    }

    loadPatientData() {
        // Load patient info if needed
        this.loadVisitHistory();
    }

    async loadVisitHistory() {
        try {
            const response = await fetch('/patient/getVisitHistory');
            const data = await response.json();
            
            if (data.success) {
                this.updateVisitHistoryTable(data.data);
            } else {
                this.showError('Không thể tải lịch sử khám bệnh');
            }
        } catch (error) {
            console.error('Error loading visit history:', error);
            this.showError('Lỗi kết nối khi tải lịch sử khám bệnh');
        }
    }

    updateVisitHistoryTable(visits) {
        const tbody = document.querySelector('#visitHistoryTable tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        visits.forEach(visit => {
            const row = this.createVisitRow(visit);
            tbody.appendChild(row);
        });

        // Update filter options
        this.updateFilterOptions(visits);
    }

    createVisitRow(visit) {
        const row = document.createElement('tr');
        row.className = 'visit-history-row';
        row.dataset.visitId = visit.id;

        const visitDate = new Date(visit.visit_date).toLocaleDateString('vi-VN');
        const diagnosis = visit.diagnosis?.map(d => d.description).join(', ') || 'N/A';
        const vitalSigns = this.formatVitalSignsForTable(visit.vital_signs);

        row.innerHTML = `
            <td>${visitDate}</td>
            <td><span class="badge bg-primary department-badge">${visit.department || 'N/A'}</span></td>
            <td><div class="text-truncate" style="max-width: 200px;" title="${visit.reason_for_visit || ''}">${visit.reason_for_visit || 'N/A'}</div></td>
            <td><div class="text-truncate" style="max-width: 200px;" title="${diagnosis}">${diagnosis}</div></td>
            <td><small>${vitalSigns}</small></td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="window.location.href='/patient/detail/${visit.id}'">
                    <i class="fas fa-eye"></i> Chi tiết
                </button>
            </td>
        `;

        return row;
    }

    formatVitalSignsForTable(vitalSigns) {
        if (!vitalSigns) return '<span class="text-muted">N/A</span>';

        const formatted = [];
        if (vitalSigns.temperature) formatted.push(`Nhiệt độ: ${vitalSigns.temperature}°C`);
        if (vitalSigns.blood_pressure) formatted.push(`HA: ${vitalSigns.blood_pressure}`);
        if (vitalSigns.pulse) formatted.push(`Mạch: ${vitalSigns.pulse} bpm`);

        return formatted.slice(0, 2).join('<br>') + (formatted.length > 2 ? '<br>...' : '');
    }

    updateFilterOptions(visits) {
        // Update department filter
        const departmentFilter = document.getElementById('departmentFilter');
        if (departmentFilter) {
            const departments = [...new Set(visits.map(v => v.department).filter(d => d))];
            this.updateSelectOptions(departmentFilter, departments);
        }

        // Update year filter
        const dateFilter = document.getElementById('dateFilter');
        if (dateFilter) {
            const years = [...new Set(visits.map(v => new Date(v.visit_date).getFullYear()))];
            years.sort((a, b) => b - a);
            this.updateSelectOptions(dateFilter, years);
        }
    }

    updateSelectOptions(select, options) {
        // Keep the first option (All)
        const firstOption = select.firstElementChild;
        select.innerHTML = '';
        select.appendChild(firstOption);

        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            select.appendChild(optionElement);
        });
    }

    filterTable() {
        const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
        const selectedDepartment = document.getElementById('departmentFilter')?.value || '';
        const selectedYear = document.getElementById('dateFilter')?.value || '';

        const table = document.getElementById('visitHistoryTable');
        if (!table) return;

        const rows = table.querySelectorAll('tbody tr');

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            const date = cells[0]?.textContent || '';
            const department = cells[1]?.textContent || '';
            const reason = cells[2]?.textContent.toLowerCase() || '';
            const diagnosis = cells[3]?.textContent.toLowerCase() || '';

            const matchesSearch = !searchTerm || reason.includes(searchTerm) || diagnosis.includes(searchTerm);
            const matchesDepartment = !selectedDepartment || department.includes(selectedDepartment);
            const matchesYear = !selectedYear || date.includes(selectedYear);

            row.style.display = (matchesSearch && matchesDepartment && matchesYear) ? '' : 'none';
        });

        this.updateResultCount();
    }

    updateResultCount() {
        const table = document.getElementById('visitHistoryTable');
        if (!table) return;

        const visibleRows = table.querySelectorAll('tbody tr:not([style*="display: none"])');
        const resultCount = document.getElementById('resultCount');
        
        if (resultCount) {
            resultCount.textContent = `Hiển thị ${visibleRows.length} kết quả`;
        }
    }

    clearFilters() {
        document.getElementById('searchInput').value = '';
        document.getElementById('departmentFilter').value = '';
        document.getElementById('dateFilter').value = '';
        this.filterTable();
    }

    handleVisitRowClick(event) {
        // Don't trigger on button clicks
        if (event.target.closest('button')) return;

        const visitId = event.currentTarget.dataset.visitId;
        if (visitId) {
            window.location.href = `/patient/detail/${visitId}`;
        }
    }

    async loadMoreVisits() {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (!loadMoreBtn) return;

        loadMoreBtn.disabled = true;
        loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang tải...';

        try {
            // Implementation for pagination
            // This would depend on your backend API
            const offset = document.querySelectorAll('#visitHistoryTable tbody tr').length;
            const response = await fetch(`/patient/getVisitHistory?offset=${offset}&limit=10`);
            const data = await response.json();

            if (data.success && data.data.length > 0) {
                this.appendVisitsToTable(data.data);
                
                if (data.data.length < 10) {
                    loadMoreBtn.style.display = 'none';
                }
            } else {
                loadMoreBtn.style.display = 'none';
            }
        } catch (error) {
            console.error('Error loading more visits:', error);
            this.showError('Lỗi khi tải thêm lịch sử khám bệnh');
        } finally {
            loadMoreBtn.disabled = false;
            loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> Tải thêm';
        }
    }

    appendVisitsToTable(visits) {
        const tbody = document.querySelector('#visitHistoryTable tbody');
        if (!tbody) return;

        visits.forEach(visit => {
            const row = this.createVisitRow(visit);
            tbody.appendChild(row);
        });
    }

    printPage() {
        window.print();
    }

    showError(message) {
        // Create or update error alert
        let errorAlert = document.getElementById('errorAlert');
        if (!errorAlert) {
            errorAlert = document.createElement('div');
            errorAlert.id = 'errorAlert';
            errorAlert.className = 'alert alert-danger alert-dismissible fade show';
            errorAlert.innerHTML = `
                <strong>Lỗi!</strong> <span id="errorMessage"></span>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;
            document.querySelector('.container').prepend(errorAlert);
        }

        document.getElementById('errorMessage').textContent = message;
        errorAlert.style.display = 'block';

        // Auto hide after 5 seconds
        setTimeout(() => {
            errorAlert.style.display = 'none';
        }, 5000);
    }

    showSuccess(message) {
        let successAlert = document.getElementById('successAlert');
        if (!successAlert) {
            successAlert = document.createElement('div');
            successAlert.id = 'successAlert';
            successAlert.className = 'alert alert-success alert-dismissible fade show';
            successAlert.innerHTML = `
                <strong>Thành công!</strong> <span id="successMessage"></span>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;
            document.querySelector('.container').prepend(successAlert);
        }

        document.getElementById('successMessage').textContent = message;
        successAlert.style.display = 'block';

        setTimeout(() => {
            successAlert.style.display = 'none';
        }, 3000);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize patient manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new PatientManager();
});

// Additional utility functions for patient module
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return dateString;
    }
}

function formatVitalSigns(vitalSigns) {
    if (!vitalSigns) return {};
    
    const formatted = {};
    
    if (vitalSigns.temperature) formatted['Nhiệt độ'] = `${vitalSigns.temperature}°C`;
    if (vitalSigns.blood_pressure) formatted['Huyết áp'] = `${vitalSigns.blood_pressure} mmHg`;
    if (vitalSigns.pulse) formatted['Nhịp tim'] = `${vitalSigns.pulse} bpm`;
    if (vitalSigns.respiratory_rate) formatted['Nhịp thở'] = `${vitalSigns.respiratory_rate} lần/phút`;
    if (vitalSigns.weight) formatted['Cân nặng'] = `${vitalSigns.weight} kg`;
    if (vitalSigns.height) formatted['Chiều cao'] = `${vitalSigns.height} cm`;
    
    return formatted;
}

function downloadTestFile(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'test_result.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}