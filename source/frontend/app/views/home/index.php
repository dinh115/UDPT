<?php
$title = 'MedPortal - Trang chủ';
$description = 'Hệ thống quản lý bệnh viện toàn diện, giúp bác sĩ và bệnh nhân kết nối hiệu quả.';
require_once(__DIR__ . '/../template/header.php');
?>

<body class="d-flex flex-column min-vh-100">
    <!-- <div class="header">
        <h1><?php echo htmlspecialchars($data['title']); ?></h1>
    </div> -->

    <?php require_once(__DIR__ . '/../template/navbar.php'); ?>
    <main class="flex-grow-1">

        <!-- Hero Section -->
        <section class="hero-section">
            <div class="container">
                <div class="hero-content">
                    <h1 class="hero-title"><?php echo $title ?></h1>
                    <p class="hero-description"><?php echo $description ?></p>
                </div>
            </div>
        </section>
        <!-- Main Content -->
        <div class="container">
            <!-- Dashboard Grid -->
            <div class="dashboard-grid">

                <!-- Quick Actions -->
                <!-- Phân quyền lại -->
                <div class="quick-actions">
                    <a href="/patients/new" class="action-btn">
                        <i class="fas fa-user-plus"></i>
                        <span>Hồ sơ bệnh nhân</span>
                    </a>
                    <a href="/doctors/#doctorList" class="action-btn">
                        <i class="fas fa-calendar-plus"></i>
                        <span>Đặt lịch hẹn</span>
                    </a>
                    <a href="/medicine" class="action-btn">
                        <i class="fas fa-prescription"></i>
                        <span>Quản lý thuốc</span>
                    </a>
                    <a href="/reports/generate" class="action-btn">
                        <i class="fas fa-file-alt"></i>
                        <span>Thống kê</span>
                    <a href="/reminder" class="action-btn">
                        <i class="fas fa-bell"></i>
                        <span>Nhắc nhở</span>
                    </a>
                </div>
            </div>
        </div>
    </main>

    <?php require_once(__DIR__ . '/../template/footer.php'); ?>
    <?php require_once(__DIR__ . '/../template/scripts.php'); ?>
    <script src='<?= $baseUrl ?>/js/home.js'></script>

</body>

</html>