<?php require_once(__DIR__ . '/../template/header.php'); ?>

<body>
    <div class="login-container">
        <div class="register-card">
            <div class="login-header">
                <h2><i class="fas fa-user-plus text-primary"></i></h2>
                <p>Tạo tài khoản mới</p>
            </div>

            <?php if (isset($_GET['msg']) && $_GET['msg'] === 'registered'): ?>
                <div class="alert success-message">
                    <i class="fas fa-check-circle"></i> Đăng ký thành công. Vui lòng đăng nhập.
                </div>
            <?php endif; ?>

            <?php if (!empty($errors)): ?>
                <div class="alert alert-danger d-flex align-items-start flex-column gap-2">
                    <div><i class="fas fa-exclamation-triangle me-2"></i><strong>Đã xảy ra lỗi:</strong></div>
                    <ul class="mb-0 ps-4">
                        <?php foreach ($errors as $err): ?>
                            <li><?php echo htmlspecialchars($err); ?></li>
                        <?php endforeach; ?>
                    </ul>
                </div>
            <?php endif; ?>

            <form method="POST" id="registerForm">
                <!-- Row 1: Username and Email -->
                <div class="form-row">
                    <div class="form-floating">
                        <input type="text" class="form-control" id="username" name="username"
                            placeholder="johndoe" required
                            value="<?php echo htmlspecialchars($_POST['username'] ?? ''); ?>">
                        <label for="username"><i class="fas fa-user me-2"></i>Tên người dùng</label>
                    </div>
                    <div class="form-floating">
                        <input type="email" class="form-control" id="email" name="email"
                            placeholder="john.doe@example.com" required
                            value="<?php echo htmlspecialchars($_POST['email'] ?? ''); ?>">
                        <label for="email"><i class="fas fa-envelope me-2"></i>Email</label>
                    </div>
                </div>

                <!-- Row 2: Last Name, First Name, Date of Birth -->
                <div class="form-row-three">
                    <div class="form-floating">
                        <input type="text" class="form-control" id="lastName" name="lastName"
                            placeholder="Nguyễn" required
                            value="<?php echo htmlspecialchars($_POST['lastName'] ?? ''); ?>">
                        <label for="lastName"><i class="fas fa-user me-2"></i>Họ</label>
                    </div>
                    <div class="form-floating">
                        <input type="text" class="form-control" id="firstName" name="firstName"
                            placeholder="Bảo" required
                            value="<?php echo htmlspecialchars($_POST['firstName'] ?? ''); ?>">
                        <label for="firstName"><i class="fas fa-user me-2"></i>Tên</label>
                    </div>
                    <div class="form-floating">
                        <input type="date" class="form-control" id="dateOfBirth" name="dateOfBirth"
                            required max="<?php echo date('Y-m-d', strtotime('-13 years')); ?>"
                            value="<?php echo htmlspecialchars($_POST['dateOfBirth'] ?? ''); ?>">
                        <label for="dateOfBirth"><i class="fas fa-calendar me-2"></i>Ngày sinh</label>
                    </div>
                </div>

                <!-- Row 3: Address, Phone -->
                <div class="form-row">
                    <div class="form-floating">
                        <input type="text" class="form-control" id="address" name="address"
                            placeholder="123 Đường ABC, Quận 1, TP.HCM" required
                            value="<?php echo htmlspecialchars($_POST['address'] ?? ''); ?>">
                        <label for="address"><i class="fas fa-map-marker-alt me-2"></i>Địa chỉ</label>
                    </div>
                    <div class="form-floating">
                        <input type="tel" class="form-control" id="phone" name="phone"
                            placeholder="+84908817379" required
                            value="<?php echo htmlspecialchars($_POST['phone'] ?? ''); ?>">
                        <label for="phone"><i class="fas fa-phone me-2"></i>Số điện thoại</label>
                    </div>
                </div>

                <!-- Row 4: Password and Confirmed Password -->
                <div class="form-row">
                    <div class="form-floating position-relative">
                        <input type="password" class="form-control" id="password" name="password"
                            placeholder="Password" required>
                        <label for="password"><i class="fas fa-key me-2"></i>Mật khẩu</label>
                        <button type="button" class="password-toggle" onclick="togglePassword('password', 'passwordToggleIcon')">
                            <i class="fas fa-eye" id="passwordToggleIcon"></i>
                        </button>
                    </div>
                    <div class="form-floating position-relative">
                        <input type="password" class="form-control" id="confirmedPassword" name="confirmedPassword"
                            placeholder="Nhập lại mật khẩu" required>
                        <label for="confirmedPassword"><i class="fas fa-key me-2"></i>Nhập lại mật khẩu</label>
                        <button type="button" class="password-toggle" onclick="togglePassword('confirmedPassword', 'confirmToggleIcon')">
                            <i class="fas fa-eye" id="confirmToggleIcon"></i>
                        </button>
                    </div>
                </div>

                <button type="submit" class="btn btn-primary btn-login">
                    <span class="loading-spinner spinner-border spinner-border-sm me-2" role="status"></span>
                    <i class="fas fa-user-plus me-2"></i>Đăng ký
                </button>

                <div class="text-center mt-3">
                    <a href="/auth/login" class="text-decoration-none">
                        <i class="fas fa-sign-in-alt" aria-hidden="true"></i>
                        Đã có tài khoản? Đăng nhập
                    </a>
                </div>
            </form>

        </div>
    </div>

    <style>
        .register-card {
            background: white;
            border-radius: 20px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
            padding: 3rem;
            width: 100%;
            max-width: 600px;
            position: relative;
            overflow: hidden;
        }

        .register-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: var(--gradient-primary);
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            margin-bottom: 1.5rem;
        }

        .form-row-three {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 1rem;
            margin-bottom: 1.5rem;
        }

        .form-floating {
            margin-bottom: 0;
        }

        .form-floating:not(.form-row .form-floating):not(.form-row-three .form-floating) {
            margin-bottom: 1.5rem;
        }

        @media (max-width: 768px) {
            .form-row {
                grid-template-columns: 1fr;
                gap: 0;
            }

            .form-row-three {
                grid-template-columns: 1fr;
                gap: 0;
            }

            .form-row .form-floating,
            .form-row-three .form-floating {
                margin-bottom: 1.5rem;
            }

            .register-card {
                max-width: 400px;
                padding: 2rem;
            }
        }

        .form-control[type="date"] {
            color: #666;
        }

        .form-control[type="date"]::-webkit-calendar-picker-indicator {
            color: #667eea;
            cursor: pointer;
        }
    </style>

    <?php require_once(__DIR__ . '/../template/scripts.php'); ?>
    <script>
        // Toggle password visibility
        function togglePassword(fieldId, iconId) {
            const passwordField = document.getElementById(fieldId);
            const toggleIcon = document.getElementById(iconId);

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

        // Phone number formatting
        document.getElementById('phone').addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');

            // Add +84 prefix if not present
            if (value.length > 0 && !value.startsWith('84')) {
                if (value.startsWith('0')) {
                    value = '84' + value.substring(1);
                } else {
                    value = '84' + value;
                }
            }

            // Format as +84xxxxxxxxx
            if (value.length > 2) {
                e.target.value = '+' + value;
            }
        });

        // Form validation
        document.getElementById('registerForm').addEventListener('submit', function(e) {
            const password = document.getElementById('password').value;
            const terms = document.getElementById('terms').checked;
            const dateOfBirth = document.getElementById('dateOfBirth').value;
            const phone = document.getElementById('phone').value;

            // Check password strength
            if (password.length < 6) {
                e.preventDefault();
                alert('Mật khẩu phải có ít nhất 6 ký tự!');
                return;
            }

            // Check age (must be at least 13 years old)
            const birthDate = new Date(dateOfBirth);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();

            if (age < 13 || (age === 13 && monthDiff < 0) || (age === 13 && monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                e.preventDefault();
                alert('Bạn phải từ 13 tuổi trở lên để đăng ký!');
                return;
            }

            // Check phone number format
            if (!phone.match(/^\+84\d{9,10}$/)) {
                e.preventDefault();
                alert('Số điện thoại không hợp lệ! Vui lòng nhập theo định dạng +84xxxxxxxxx');
                return;
            }

            // Check terms acceptance
            if (!terms) {
                e.preventDefault();
                alert('Vui lòng đồng ý với điều khoản dịch vụ!');
                return;
            }

            // Loading state handling
            const submitBtn = this.querySelector('button[type="submit"]');
            const spinner = this.querySelector('.loading-spinner');

            submitBtn.disabled = true;
            spinner.style.display = 'inline-block';

            // Re-enable button after 5 seconds as fallback
            setTimeout(() => {
                submitBtn.disabled = false;
                spinner.style.display = 'none';
            }, 5000);
        });

        // Auto-hide success message
        setTimeout(() => {
            const successAlert = document.querySelector('.success-message');
            if (successAlert) {
                successAlert.style.transition = 'opacity 0.5s ease';
                successAlert.style.opacity = '0';
                setTimeout(() => successAlert.remove(), 500);
            }
        }, 5000);
    </script>

</body>

</html>