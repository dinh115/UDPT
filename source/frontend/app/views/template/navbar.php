  <?php function isActive($route)
    {
        $currentPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        return rtrim($currentPath, '/') === rtrim($route, '/') ? 'active' : '';
    }
    ?>

  <!-- Navigation -->
  <nav class="navbar navbar-expand-lg">
      <div class="container">
          <a class="navbar-brand" href="/">
              <i class="fas fa-heartbeat me-2"></i>MedPortal
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
              <ul class="navbar-nav me-auto">
                  <li class="nav-item">
                      <a class="nav-link <?= isActive('/') ?>" href="/">
                          <i class="fas fa-home me-1"></i> Trang chủ
                      </a>
                  </li>
                  <li class="nav-item">
                      <a class="nav-link <?= isActive('/users') ?>" href="/users">
                          <i class="fas fa-users me-1"></i>Bệnh nhân
                      </a>
                  </li>
                  <li class="nav-item">
                      <a class="nav-link <?= isActive('/doctors') ?>" href="/doctors">
                          <i class="fas fa-user-md me-1"></i>Bác sĩ
                      </a>
                  </li>
                  <li class="nav-item">
                      <a class="nav-link <?= isActive('/home/about') ?>" href="/home/about">
                          <i class="fas fa-info-circle me-1"></i>Giới thiệu
                      </a>
                  </li>
              </ul>
              <ul class="navbar-nav">
                  <?php if (isset($_SESSION['user_session']) && $_SESSION['user_session']['logged_in']): ?>
                      <?php
                        $role = $_SESSION['user_session']['user']['role'] ?? '';
                        $roleLabels = [
                            'admin' => ['label' => 'Quản trị viên', 'class' => 'bg-danger'],
                            'doctor' => ['label' => 'Bác sĩ', 'class' => 'bg-primary'],
                            'employee' => ['label' => 'Nhân viên', 'class' => 'bg-success'],
                            'patient' => ['label' => 'Bệnh nhân', 'class' => 'bg-warning text-dark']
                        ];
                        $roleLabel = $roleLabels[$role] ?? ['label' => 'Không xác định', 'class' => 'bg-secondary'];
                        ?>
                      <li class="nav-item dropdown">
                          <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                              <span class="badge <?= $roleLabel['class'] ?> me-2"><?= $roleLabel['label'] ?></span>
                              <i class="fas fa-user-circle me-1"></i><?= htmlspecialchars($_SESSION['user_session']['user']['username']) ?>
                          </a>
                          <ul class="dropdown-menu dropdown-menu-end mt-2" style="min-width: 100%;">
                                <?php
                                    $profileLink = match ($role) {
                                        'patient' => '/patients',
                                        'doctor' => '/doctors/navbarToShow/'. $_SESSION['user_session']['user']['id'],
                                        default => '/home'
                                    };
                                ?>
                                <li><a class="dropdown-item" href="<?= $profileLink ?>"><i class="fas fa-user me-2"></i>Hồ sơ của tôi</a></li>
                              <li>
                                  <hr class="dropdown-divider">
                              </li>
                              <li><a class="dropdown-item" href="/auth/logout"><i class="fas fa-sign-out-alt me-2"></i>Đăng xuất</a></li>
                          </ul>
                      </li>
                  <?php else: ?>
                      <li class="nav-item">
                          <a class="nav-link <?= isActive('/auth/login') ?>" href="/auth/login">
                              <i class="fas fa-sign-in-alt me-1"></i>Đăng nhập
                          </a>
                      </li>
                  <?php endif; ?>
              </ul>

          </div>
      </div>
  </nav>