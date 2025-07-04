<?php require_once(__DIR__ . '/../template/header.php'); ?>

<body>
    <div class="header">
        <h1><?php echo htmlspecialchars($data['title']); ?></h1>
    </div>

    <?php require_once(__DIR__ . '/../template/navbar.php'); ?>

    <?php require_once(__DIR__ . '/../template/scripts.php'); ?>

</body>

</html>