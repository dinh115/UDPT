<?php require_once(__DIR__ . '/../template/header.php'); ?>

<body>
    <div class="header">
        <h1><?php echo htmlspecialchars($data['title']); ?></h1>
    </div>
    
<?php require_once(__DIR__ . '/../template/navbar.php'); ?>

    <?php if (isset($data['user'])): ?>
        <div class="user-details">
            <div class="detail-row">
                <strong>Name:</strong> <?php echo htmlspecialchars($data['user']['name'] ?? 'N/A'); ?>
            </div>
            <div class="detail-row">
                <strong>Username:</strong> <?php echo htmlspecialchars($data['user']['username'] ?? 'N/A'); ?>
            </div>
            <div class="detail-row">
                <strong>Email:</strong> <?php echo htmlspecialchars($data['user']['email'] ?? 'N/A'); ?>
            </div>
            <div class="detail-row">
                <strong>Phone:</strong> <?php echo htmlspecialchars($data['user']['phone'] ?? 'N/A'); ?>
            </div>
            <div class="detail-row">
                <strong>Website:</strong> <?php echo htmlspecialchars($data['user']['website'] ?? 'N/A'); ?>
            </div>
            <?php if (isset($data['user']['address'])): ?>
                <div class="detail-row">
                    <strong>Address:</strong>
                    <?php 
                    $address = $data['user']['address'];
                    echo htmlspecialchars(
                        ($address['street'] ?? '') . ' ' . 
                        ($address['suite'] ?? '') . ', ' . 
                        ($address['city'] ?? '') . ' ' . 
                        ($address['zipcode'] ?? '')
                    );
                    ?>
                </div>
            <?php endif; ?>
            <?php if (isset($data['user']['company'])): ?>
                <div class="detail-row">
                    <strong>Company:</strong> <?php echo htmlspecialchars($data['user']['company']['name'] ?? 'N/A'); ?>
                </div>
            <?php endif; ?>
        </div>
    <?php endif; ?>
    
    <div class="actions my-2">
        <a href="/users">Back to Users</a>
    </div>
    <?php require_once(__DIR__ . '/../template/scripts.php'); ?>

</body>
</html>