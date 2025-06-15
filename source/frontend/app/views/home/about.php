<?php require_once(__DIR__ . '/../template/header.php'); ?>
<body>
    <div class="header">
        <h1><?php echo htmlspecialchars($data['title']); ?></h1>
    </div>
    
<?php require_once(__DIR__ . '/../template/navbar.php'); ?>
    
    <div class="content">
        <p>This is a PHP MVC application that demonstrates how to build a frontend that consumes API data.</p>
        
        <h3>Features:</h3>
        <ul>
            <li>Clean MVC architecture</li>
            <li>API integration using cURL</li>
            <li>Error handling</li>
            <li>Dynamic content loading with JavaScript</li>
            <li>Responsive design</li>
        </ul>
        
        <h3>API Source:</h3>
        <p>This application uses <a href="https://jsonplaceholder.typicode.com">JSONPlaceholder</a> as a demo API service.</p>
    </div>
    <?php require_once(__DIR__ . '/../template/scripts.php'); ?>

</body>
</html>