<?php require_once(__DIR__ . '/../template/header.php'); ?>

<body>
    <div class="login-container">
        <div class="login-card">
            <div class="login-header">
                <h2><i class="fas fa-lock text-primary"></i></h2>
                <p>Vui lòng đăng nhập</p>
            </div>

            <?php if (isset($_GET['msg']) && $_GET['msg'] === 'logged_out'): ?>
                <div class="alert success-message">
                    <i class="fas fa-check-circle"></i> Đăng xuất thành công.
                </div>
            <?php endif; ?>

            <?php if (isset($error) && $error): ?>
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle"></i> <?php echo htmlspecialchars($error); ?>
                </div>
            <?php endif; ?>

            <form method="POST" id="loginForm">
                <div class="form-floating">
                    <input type="username" class="form-control" id="username" name="username"
                        placeholder="XxepicusrnamexX" required
                        value="<?php echo htmlspecialchars($_POST['username'] ?? ''); ?>">
                    <label for="username"><i class="fas fa-envelope me-2"></i>Username</label>
                </div>

                <div class="form-floating position-relative">
                    <input type="password" class="form-control" id="password" name="password"
                        placeholder="Password" required>
                    <label for="password"><i class="fas fa-key me-2"></i>Password</label>
                    <button type="button" class="password-toggle" onclick="togglePassword()">
                        <i class="fas fa-eye" id="passwordToggleIcon"></i>
                    </button>
                </div>

                <!-- <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="remember" name="remember">
                    <label class="form-check-label text-dark" for="remember">
                        Lưu thông tin đăng nhập
                    </label>
                </div> -->

                <button type="submit" class="btn btn-primary btn-login">
                    <span class="loading-spinner spinner-border spinner-border-sm me-2" role="status"></span>
                    <i class="fas fa-sign-in-alt me-2"></i>Đăng nhập
                </button>

                <div class="text-center mt-3">
                    <a href="/auth/register" class="text-decoration-none">
                        <i class="fa fa-user-plus" aria-hidden="true"></i>
                        Đăng ký
                    </a>
                </div>
            </form>
        </div>
    </div>

    <?php require_once(__DIR__ . '/../template/scripts.php'); ?>
    <script>
        // Toggle password visibility
        function togglePassword() {
            const passwordField = document.getElementById('password');
            const toggleIcon = document.getElementById('passwordToggleIcon');

            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                toggleIcon.classList.remove('fa-eye');
                toggleIcon.classList.add('fa-eye-slash');
            } else {
                passwordField.type = 'password';
                toggleIcon.classList.remove('fa-eye-slash');
                toggleIcon.classList.add('fa-eye');
            }
        }

        // Loading state handling
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('button[type="submit"]');
            const spinner = this.querySelector('.loading-spinner');

            submitBtn.disabled = true;
            spinner.style.display = 'inline-block';

            // Re-enable button after 3 seconds as fallback
            setTimeout(() => {
                submitBtn.disabled = false;
                spinner.style.display = 'none';
            }, 3000);
        });

        // Auto-hide success message
        setTimeout(() => {
            const successAlert = document.querySelector('.success-message');
            if (successAlert) {
                successAlert.style.transition = 'opacity 0.5s ease';
                successAlert.style.opacity = '0';
                setTimeout(() => successAlert.remove(), 500);
            }
        }, 3000);
    </script>

</body>

</html>