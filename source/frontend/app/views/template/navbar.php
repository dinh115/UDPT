    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
            <a class="navbar-brand" href="/">Hostiple Project</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link" href="/">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/users">Users</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/home/about">About  </a>
                    </li>
                </ul>
                <!-- login -->
                <ul class="navbar-nav ms-auto">
                    <?php if (isset($_SESSION['user']) || FALSE) : ?>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" role="button"
                                data-bs-toggle="dropdown" aria-expanded="false">
                                <span class="me-1">Hi,</span>
                                <strong class="me-2 fw-semibold"><?php echo $_SESSION['user']['UserName']; ?></strong>
                                <span id="changeThis"
                                    class="badge bg-success me-e"><?php echo $_SESSION['user']['Role']; ?></span>
                            </a>

                            <ul class="dropdown-menu">
                                <li>
                                    <a class="dropdown-item" href="#" data-bs-toggle="modal"
                                        data-bs-target="#updateRoleModal">
                                        Update Role
                                    </a>
                                </li>
                                <li>
                                    <form action="/logout" method="POST" style="margin: 0;">
                                        <button type="submit" class="dropdown-item">Logout</button>
                                    </form>
                                </li>
                            </ul>

                        </li>
                    <?php else: ?>
                        <li class="nav-item">
                            <a class="btn btn-primary me-2" href="/login">Login</a>
                        </li>
                    <?php endif; ?>
                </ul>

            </div>
        </div>
    </nav>