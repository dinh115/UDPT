  <?php
    session_start();
    function isActive($route)
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
                      <a class="nav-link <?= isActive('/appointments') ?>" href="/appointments">
                          <i class="fas fa-calendar-check me-1"></i>Lịch hẹn
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
                  <?php if (isset($_SESSION['user'])): ?>
                      <li class="nav-item dropdown">
                          <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                              <i class="fas fa-user-circle me-1"></i><?= htmlspecialchars($_SESSION['user']['name']) ?>
                          </a>
                          <ul class="dropdown-menu">
                              <li><a class="dropdown-item" href="/profile"><i class="fas fa-user me-2"></i>Hồ sơ của tôi</a></li>
                              <li><a class="dropdown-item" href="/settings"><i class="fas fa-cog me-2"></i>Cài đặt</a></li>
                              <li>
                                  <hr class="dropdown-divider">
                              </li>
                              <li><a class="dropdown-item" href="/logout"><i class="fas fa-sign-out-alt me-2"></i>Đăng xuất</a></li>
                          </ul>
                      </li>
                  <?php else: ?>
                      <li class="nav-item">
                          <a class="nav-link <?= isActive('/login') ?>" href="/login">
                              <i class="fas fa-sign-in-alt me-1"></i>Đăng nhập
                          </a>
                      </li>
                  <?php endif; ?>
              </ul>

          </div>
      </div>
  </nav>