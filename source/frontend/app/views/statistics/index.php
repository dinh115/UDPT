<?php require_once(__DIR__ . '/../template/header.php'); ?>

<body>
    <?php require_once(__DIR__ . '/../template/navbar.php'); ?>
   
    <div class="container mt-4">
        <h1 class="mb-4 text-dark">Thống kê</h1>
       
        <!-- Filter Section -->
        <div class="card mb-4">
            <div class="card-header py-3">
                <h5 class="mb-0 text-dark">Bộ lọc</h5>
            </div>
            <div class="card-body">
                <form id="filterForm">
                    <div class="row">
                        <div class="col-md-4">
                            <label for="startDate" class="form-label">Ngày bắt đầu</label>
                            <input type="date" class="form-control" id="startDate" name="startDate" value="2025-06-01">
                        </div>
                        <div class="col-md-4">
                            <label for="endDate" class="form-label">Ngày kết thúc</label>
                            <input type="date" class="form-control" id="endDate" name="endDate" value="2025-07-31">
                        </div>
                        <div class="col-md-4">
                            <label for="groupType" class="form-label">Nhóm theo</label>
                            <select class="form-select" id="groupType" name="groupType">
                                <option value="BY_DAY">Theo ngày</option>
                                <option value="BY_MONTH" selected>Theo tháng</option>
                                <option value="BY_YEAR">Theo năm</option>
                            </select>
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-12">
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-filter"></i> Lọc dữ liệu
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <!-- Charts Section -->
        <div class="row">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header py-3">
                        <h5 class="mb-0 text-dark">Thống kê số lượng bệnh nhân</h5>
                    </div>
                    <div class="card-body">
                        <canvas id="patientChart" width="400" height="200"></canvas>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header py-3">
                        <h5 class="mb-0 text-dark">Thống kê số lượng đơn thuốc</h5>
                    </div>
                    <div class="card-body">
                        <canvas id="prescriptionChart" width="400" height="200"></canvas>
                    </div>
                </div>
            </div>
        </div>

        <!-- Loading indicator -->
        <div id="loading" class="text-center mt-4" style="display: none;">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Đang tải dữ liệu...</p>
        </div>
    </div>

    <?php require_once(__DIR__ . '/../template/footer.php'); ?>
    <?php require_once(__DIR__ . '/../template/scripts.php'); ?>
   
    <!-- jQuery (make sure this is loaded first) -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    
    <!-- Toast notifications -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css">
    
    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    
    <script>
        $(document).ready(function() {
            let patientChart = null;
            let prescriptionChart = null;
           
            // Initialize charts on page load
            loadStatistics();
           
            // Handle form submission
            $('#filterForm').on('submit', function(e) {
                e.preventDefault();
                console.log('Form submitted!'); // Debug log
                loadStatistics();
            });
           
            /**
             * Load statistics data and update charts
             */
            function loadStatistics() {
                const startDate = $('#startDate').val();
                const endDate = $('#endDate').val();
                const groupType = $('#groupType').val();
               
                console.log('Loading statistics with:', { startDate, endDate, groupType }); // Debug log
               
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
               
                // Make AJAX request - Updated URL to match your controller
                $.ajax({
                    url: '/reports/getStatistics', // Updated to match your routing
                    method: 'POST',
                    data: {
                        action: 'getStatistics',
                        startDate: startDate,
                        endDate: endDate,
                        groupType: groupType
                    },
                    dataType: 'json',
                    beforeSend: function() {
                        console.log('Sending AJAX request...'); // Debug log
                    },
                    success: function(response) {
                        console.log('AJAX Success:', response); // Debug log
                        if (response.success) {
                            updateCharts(response.data);
                            toastr.success('Dữ liệu đã được cập nhật');
                        } else {
                            toastr.error(response.error || 'Có lỗi xảy ra');
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error('AJAX Error:', { xhr, status, error }); // Debug log
                        console.error('Response Text:', xhr.responseText); // Debug log
                        toastr.error('Không thể tải dữ liệu: ' + error);
                    },
                    complete: function() {
                        console.log('AJAX request completed'); // Debug log
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
    </script>
</body>
</html>