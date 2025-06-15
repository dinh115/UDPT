<?php require_once(__DIR__ . '/../template/header.php'); ?>

<body>
    <div class="header">
        <h1><?php echo htmlspecialchars($data['title']); ?></h1>
    </div>
    
<?php require_once(__DIR__ . '/../template/navbar.php'); ?>

    
    <?php if (isset($data['error'])): ?>
        <div class="error">
            <p>Error loading users: <?php echo htmlspecialchars($data['error']); ?></p>
        </div>
    <?php endif; ?>
    
    <div class="actions my-2" >
        <button class="btn" onclick="refreshUsers()">Refresh Users</button>
    </div>
    
    <div id="users-container">
        <?php if (!empty($data['users'])): ?>
            <?php foreach($data['users'] as $user): ?>
                <div class="card">
                    <h3><?php echo htmlspecialchars($user['name'] ?? 'N/A'); ?></h3>
                    <p><strong>Email:</strong> <?php echo htmlspecialchars($user['email'] ?? 'N/A'); ?></p>
                    <p><strong>Username:</strong> <?php echo htmlspecialchars($user['username'] ?? 'N/A'); ?></p>
                    <p><strong>Phone:</strong> <?php echo htmlspecialchars($user['phone'] ?? 'N/A'); ?></p>
                    <p><strong>Website:</strong> <?php echo htmlspecialchars($user['website'] ?? 'N/A'); ?></p>
                    <div class="actions">
                        <a href="/users/show/<?php echo $user['id']; ?>" class="btn">View Details</a>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php else: ?>
            <p>No users found.</p>
        <?php endif; ?>
    </div>
    
    <?php require_once(__DIR__ . '/../template/scripts.php'); ?>

    <script>
        async function refreshUsers() {
            try {
                const response = await fetch('/users/api');
                const result = await response.json();
                
                if (result.success) {
                    updateUsersList(result.data);
                } else {
                    alert('Error: ' + result.error);
                }
            } catch (error) {
                alert('Failed to refresh users: ' + error.message);
            }
        }
        
        function updateUsersList(users) {
            const container = document.getElementById('users-container');
            if (!container) return;
            
            container.innerHTML = users.map(user => `
                <div class="card">
                    <h3>${escapeHtml(user.name || 'N/A')}</h3>
                    <p><strong>Email:</strong> ${escapeHtml(user.email || 'N/A')}</p>
                    <p><strong>Username:</strong> ${escapeHtml(user.username || 'N/A')}</p>
                    <p><strong>Phone:</strong> ${escapeHtml(user.phone || 'N/A')}</p>
                    <p><strong>Website:</strong> ${escapeHtml(user.website || 'N/A')}</p>
                    <div class="actions">
                        <a href="/users/show/${user.id}" class="btn">View Details</a>
                    </div>
                </div>
            `).join('');
        }
        
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
    </script>
</body>
</html>