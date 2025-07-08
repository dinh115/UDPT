<?php
$title = 'MedPortal - Giới thiệu';
$description = 'Đây là hệ thống quản lý bệnh viên được nhóm UPDT-03 thực hiện trong quá trình học môn Ứng dụng phân tán.';
require_once(__DIR__ . '/../template/header.php'); ?>

<body>
    <!-- <div class="header">
        <h1><?php echo htmlspecialchars($data['title']); ?></h1>
    </div> -->

    <?php require_once(__DIR__ . '/../template/navbar.php'); ?>

    <div class="hero-section">
        <div class="container">
            <div class="hero-content">
                <h1 class="hero-title"><?php echo $title ?></h1>
                <p class="hero-subtitle"><?php echo $description ?></p>
            </div>


            <div class="hero-content">
                <h1 class="hero-title">Đại học Khoa học Tự nhiên</h1>
                <p class="hero-subtitle">Học kỳ 2, Năm học 2024 - 2025</p>
            </div>
        </div>
    </div>
    <?php require_once(__DIR__ . '/../template/footer.php'); ?>
    <?php require_once(__DIR__ . '/../template/scripts.php'); ?>
    <script src='<?= $baseUrl ?>/js/home.js'></script>

</body>

</html>