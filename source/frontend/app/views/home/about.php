<?php require_once(__DIR__ . '/../template/header.php'); ?>

<body>
    <!-- <div class="header">
        <h1><?php echo htmlspecialchars($data['title']); ?></h1>
    </div> -->

    <?php require_once(__DIR__ . '/../template/navbar.php'); ?>

    <div class="hero-section">
        <div class="container">
            <div class="hero-content">
                <h1 class="hero-title">About this Website</h1>
                <p class="hero-subtitle">This is a PHP MVC application that demonstrates how to build a frontend that consumes API data.</p>
            </div>


            <div class="hero-content">
                <h1 class="hero-title">API Demo Source:</h1>
                <p class="hero-subtitle">This application uses <a href="https://jsonplaceholder.typicode.com" style="color: #ffffff">JSONPlaceholder</a> as a demo API service.</p>
            </div>
        </div>
    </div>
    <?php require_once(__DIR__ . '/../template/footer.php'); ?>
    <?php require_once(__DIR__ . '/../template/scripts.php'); ?>
    <script src='/js/home.js'></script>

</body>

</html>