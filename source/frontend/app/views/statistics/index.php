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
    
    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src='statistics.js'></script>
</body>