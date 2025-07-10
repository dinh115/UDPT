<?php require_once(__DIR__ . '/../template/header.php'); ?>

<body>
    <?php require_once(__DIR__ . '/../template/navbar.php'); ?>
    
    <div class="container mt-4">
        <h1 class="mb-4">Nhắc nhở lịch khám</h1>
        
        <div id="loading" class="text-center mt-4" style="display: none;">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Đang tải...</span>
            </div>
            <p class="mt-2">Đang tải dữ liệu lịch hẹn...</p>
        </div>

        <div class="card mb-4">
            <div class="card-header">
                <h5 class="mb-0">Các lịch hẹn sắp tới</h5>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Tên bệnh nhân</th>
                                <th>Email bệnh nhân</th>
                                <th>Ngày</th>
                                <th>Thời gian bắt đầu</th>
                                <th>Thời gian kết thúc</th>
                                <th>Tên bác sĩ</th>
                                <th>Phí tư vấn</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody id="appointmentsTableBody">
                            </tbody>
                    </table>
                </div>
                <div id="noAppointments" class="text-center mt-3" style="display: none;">
                    Không có lịch hẹn nào sắp tới.
                </div>
            </div>
        </div>
    </div>

    <?php require_once(__DIR__ . '/../template/footer.php'); ?>
    <?php require_once(__DIR__ . '/../template/scripts.php'); ?>
    
    <script src='reminder.js'></script>
</body>