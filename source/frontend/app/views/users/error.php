<?php require_once(__DIR__ . '/../template/header.php'); ?>
<body>
    <h1><?php echo htmlspecialchars($data['title']); ?></h1>
    
    <div class="error">
        <p><?php echo htmlspecialchars($data['error']); ?></p>
    </div>
    
    <a href="/users">Back to Users</a>
</body>
</html>