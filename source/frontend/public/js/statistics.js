$(document).ready(function() {
    let patientChart = null;
    let prescriptionChart = null;
    
    // Initialize charts on page load
    loadStatistics();
    
    // Handle form submission
    $('#filterForm').on('submit', function(e) {
        e.preventDefault();
        loadStatistics();
    });
    
    /**
     * Load statistics data and update charts
     */
    function loadStatistics() {
        const startDate = $('#startDate').val();
        const endDate = $('#endDate').val();
        const groupType = $('#groupType').val();
        
        // Validate dates
        if (!startDate || !endDate) {
            toastr.error('Vui lòng chọn ngày bắt đầu và ngày kết thúc');
            return;
        }
        
        if (new Date(startDate) > new Date(endDate)) {
            toastr.error('Ngày bắt đầu phải nhỏ hơn ngày kết thúc');
            return;
        }
        
        // Show loading
        $('#loading').show();
        
        // Make AJAX request
        $.ajax({
            url: '/controllers/StatisticsController.php',
            method: 'GET',
            data: {
                action: 'getStatistics',
                startDate: startDate,
                endDate: endDate,
                groupType: groupType
            },
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    updateCharts(response.data);
                    toastr.success('Dữ liệu đã được cập nhật');
                } else {
                    toastr.error(response.error || 'Có lỗi xảy ra');
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', error);
                toastr.error('Không thể tải dữ liệu');
            },
            complete: function() {
                $('#loading').hide();
            }
        });
    }
    
    
    /**
     * Update charts with new data
     */
    function updateCharts(data) {
        updatePatientChart(data.patientStats);
        updatePrescriptionChart(data.prescriptionStats);
    }
    
    /**
     * Update patient chart
     */
    function updatePatientChart(data) {
        const ctx = document.getElementById('patientChart').getContext('2d');
        
        // Destroy existing chart if exists
        if (patientChart) {
            patientChart.destroy();
        }
        
        const labels = data.stats.map(item => item.label);
        const counts = data.stats.map(item => item.patientCount);
        
        patientChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Số lượng bệnh nhân',
                    data: counts,
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                }
            }
        });
    }
    
    /**
     * Update prescription chart
     */
    function updatePrescriptionChart(data) {
        const ctx = document.getElementById('prescriptionChart').getContext('2d');
        
        // Destroy existing chart if exists
        if (prescriptionChart) {
            prescriptionChart.destroy();
        }
        
        const labels = data.stats.map(item => item.label);
        const counts = data.stats.map(item => item.prescriptionCount);
        
        prescriptionChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Số lượng đơn thuốc',
                    data: counts,
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                }
            }
        });
    }
});