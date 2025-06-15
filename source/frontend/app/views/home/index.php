<?php require_once(__DIR__ . '/../template/header.php'); ?>

<body>
    <div class="header">
        <h1><?php echo htmlspecialchars($data['title']); ?></h1>
    </div>
    
<?php require_once(__DIR__ . '/../template/navbar.php'); ?>

    <div class="grid">
        <div class="section">
            <h2>Recent Users</h2>
            
            <?php if ($data['users_error']): ?>
                <div class="error">Error loading users: <?php echo htmlspecialchars($data['users_error']); ?></div>
            <?php endif; ?>
            
            <?php if (!empty($data['users'])): ?>
                <?php foreach(array_slice($data['users'], 0, 5) as $user): ?>
                    <div class="card">
                        <h3><?php echo htmlspecialchars($user['name'] ?? 'N/A'); ?></h3>
                        <p><strong>Email:</strong> <?php echo htmlspecialchars($user['email'] ?? 'N/A'); ?></p>
                        <p><strong>Username:</strong> <?php echo htmlspecialchars($user['username'] ?? 'N/A'); ?></p>
                        <a href="/users/show/<?php echo $user['id']; ?>">View Details</a>
                    </div>
                <?php endforeach; ?>
                <p><a href="/users">View All Users</a></p>
            <?php else: ?>
                <p>No users available.</p>
            <?php endif; ?>
        </div>
        
        <div class="section">
            <h2>Recent Posts</h2>
            
            <?php if ($data['posts_error']): ?>
                <div class="error">Error loading posts: <?php echo htmlspecialchars($data['posts_error']); ?></div>
            <?php endif; ?>
            
            <?php if (!empty($data['posts'])): ?>
                <?php foreach(array_slice($data['posts'], 0, 5) as $post): ?>
                    <div class="card">
                        <h4><?php echo htmlspecialchars($post['title'] ?? 'N/A'); ?></h4>
                        <p><?php echo htmlspecialchars(substr($post['body'] ?? '', 0, 100)) . '...'; ?></p>
                        <small>User ID: <?php echo htmlspecialchars($post['userId'] ?? 'N/A'); ?></small>
                    </div>
                <?php endforeach; ?>
            <?php else: ?>
                <p>No posts available.</p>
            <?php endif; ?>
        </div>
    </div>
    <?php require_once(__DIR__ . '/../template/scripts.php'); ?>

</body>
</html>