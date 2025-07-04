<?php require_once(__DIR__ . '/../template/header.php'); ?>

<body>
    <!-- <div class="header">
        <h1><?php echo htmlspecialchars($data['title']); ?></h1>
    </div> -->

    <?php require_once(__DIR__ . '/../template/navbar.php'); ?>

    <!-- Hero Section -->
    <section class="hero-section">
        <div class="container">
            <div class="hero-content">
                <h1 class="hero-title">MedPortal - Lịch hẹn</h1>
                <p class="hero-description">Quản lý lịch hẹn một cách hiệu quả.</p>
            </div>
        </div>
    </section>
    <!-- Main Content -->
    <div class="container">
        <!-- Dashboard Grid -->
        <div class="dashboard-grid">

            <!-- Quick Actions -->
            <div class="quick-actions">

                <a href="/appointments/schedule" class="action-btn">
                    <i class="fas fa-calendar-plus"></i>
                    <span>Đặt lịch hẹn</span>
                </a>
                <a href="/appointments/my" class="action-btn">
                    <i class="fa fa-calendar" aria-hidden="true"></i>
                    <span>Lịch hẹn của tôi</span>
                </a>
            </div>
        </div>
    </div>

    <?php require_once(__DIR__ . '/../template/footer.php'); ?>
    <?php require_once(__DIR__ . '/../template/scripts.php'); ?>
    <script src='/js/home.js'></script>

</body>

</html>