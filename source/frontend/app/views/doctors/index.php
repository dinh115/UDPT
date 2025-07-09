<?php
$title = 'MedPortal - Bác sĩ';
$description = 'Các chức năng liên quan đến bác sĩ.';
require_once(__DIR__ . '/../template/header.php'); ?>


<body>

    <?php require_once(__DIR__ . '/../template/navbar.php'); ?>

    <!-- Hero Section -->
    <section class="hero-section">
        <div class="container">
            <div class="hero-content">
                <h1 class="hero-title"><?php echo $title ?></h1>
                <p class="hero-subtitle"><?php echo $description ?></p>

            </div>
        </div>
    </section>

    <!-- Doctor Form -->
    <?php if (isset($_SESSION['user_session']) && $_SESSION['user_session']['role'] === 'admin'): ?>
        <div class="dashboard-card slide-up" id="doctorForm">
            <div class="card-header">
                <div class="card-icon">
                    <i class="fas fa-user-md"></i>
                </div>
                <div>
                    <h3 class="card-title">Hồ Sơ Bác Sĩ</h3>
                    <p class="card-subtitle">Tạo hoặc cập nhật thông tin bác sĩ</p>
                </div>
            </div>

            <form id="doctorFormElement">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="userId" class="form-label">User ID</label>
                        <input type="text" class="form-control" id="userId" required>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="specialization" class="form-label">Chuyên khoa</label>
                        <select class="form-control" id="specialization" required>
                            <option value="">Chọn chuyên khoa</option>
                            <option value="Tim mạch">Tim mạch</option>
                            <option value="Thần kinh">Thần kinh</option>
                            <option value="Chỉnh hình">Chỉnh hình</option>
                            <option value="Nhi khoa">Nhi khoa</option>
                            <option value="Da liễu">Da liễu</option>
                            <option value="Y học tổng quát">Y học tổng quát</option>
                            <option value="Phẫu thuật">Phẫu thuật</option>
                            <option value="Ung thư">Ung thư</option>
                        </select>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="experience" class="form-label">Kinh nghiệm (năm)</label>
                        <input type="number" class="form-control" id="experience" min="0" max="50" required>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="qualifications" class="form-label">Bằng cấp</label>
                        <input type="text" class="form-control" id="qualifications" placeholder="MBBS, MD, PhD...">
                    </div>
                </div>
                <!-- Availability Section -->
                <div class="mb-4">
                    <label class="form-label">Thời gian hoạt động</label>
                    <div id="availabilityContainer">
                        <div class="row">
                            <div class="col-md-4 mb-3">
                                <label class="form-label">Ngày</label>
                                <input type="date" class="form-control" id="availabilityDate" required>
                            </div>
                            <div class="col-md-4 mb-3">
                                <label class="form-label">Thời gian bắt đầu</label>
                                <input type="text" class="form-control" id="startTime" placeholder="e.g. 09:00" required>
                            </div>
                            <div class="col-md-4 mb-3">
                                <label class="form-label">Thời gian kết thúc</label>
                                <input type="text" class="form-control" id="endTime" placeholder="e.g. 17:00" required>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="d-flex gap-2">
                    <button type="submit" name="action" value="create" class="btn btn-primary">
                        <i class="fas fa-save me-2"></i>
                        <span>Tạo hồ sơ</span>
                    </button>
                    <button type="submit" name="action" value="update" class="btn btn-secondary">
                        <i class="fas fa-save me-2"></i>
                        <span>Cập nhật hồ sơ</span>
                    </button>
                </div>
            </form>
        </div>
    <?php endif ?>


    <!-- Doctor Form TEMP-->
    <?php if (isset($_SESSION['user_session']) && $_SESSION['user_session']['role'] === 'doctor'): ?>
        <div class="dashboard-card slide-up" id="doctorAvailabilyForm">
            <div class="card-header">
                <div class="card-icon">
                    <i class="fas fa-user-md"></i>
                </div>
                <div>
                    <h3 class="card-title">Hồ Sơ Bác Sĩ</h3>
                    <p class="card-subtitle">Cập nhật thời gian hoạt động</p>
                </div>
            </div>
            <div class="col-md-6 mb-3" hidden="true">
                <label for="userId" class="form-label">User ID</label>
                <input type="text" class="form-control" id="userId" required>
            </div>
            <!-- Availability Section -->
            <div class="mb-4">
                <label class="form-label">Thời gian hoạt động</label>
                <div id="availabilityContainer">
                    <div class="row">
                        <div class="col-md-4 mb-3">
                            <label class="form-label">Ngày</label>
                            <input type="date" class="form-control" id="availabilityDate" required>
                        </div>
                        <div class="col-md-4 mb-3">
                            <label class="form-label">Thời gian bắt đầu</label>
                            <input type="text" class="form-control" id="startTime" placeholder="e.g. 09:00" required>
                        </div>
                        <div class="col-md-4 mb-3">
                            <label class="form-label">Thời gian kết thúc</label>
                            <input type="text" class="form-control" id="endTime" placeholder="e.g. 17:00" required>
                        </div>
                    </div>
                </div>
            </div>

            <div class="d-flex gap-2">
                <button type="submit" name="action" value="create" class="btn btn-primary">
                    <i class="fas fa-save me-2"></i>
                    <span>Tạo hồ sơ</span>
                </button>
                <button type="submit" name="action" value="update" class="btn btn-secondary">
                    <i class="fas fa-save me-2"></i>
                    <span>Cập nhật hồ sơ</span>
                </button>
            </div>
            </form>
        </div>
    <?php endif ?>

    <!-- Doctor List -->
    <div class="dashboard-card slide-up">
        <div class="card-header">
            <div class="card-icon">
                <i class="fas fa-users"></i>
            </div>
            <div>
                <h3 class="card-title">Xem hồ sơ bác sĩ</h3>
                <p class="card-subtitle">Hỗ trợ tìm kiếm và sắp xếp</p>
            </div>
        </div>

        <!-- Filter -->
        <div class="row mb-3">
            <div class="col-md-4">
                <select class="form-control" id="specializationFilter">
                    <option value="">Tất cả chuyên khoa</option>
                    <option value="Tim mạch">Tim mạch</option>
                    <option value="Thần kinh">Thần kinh</option>
                    <option value="Chỉnh hình">Chỉnh hình</option>
                    <option value="Nhi khoa">Nhi khoa</option>
                    <option value="Da liễu">Da liễu</option>
                    <option value="Y học tổng quát">Y học tổng quát</option>
                    <option value="Phẫu thuật">Phẫu thuật</option>
                    <option value="Ung thư">Ung thư</option>
                </select>
            </div>
            <div class="col-md-4">
                <select class="form-control" id="sortBy">
                    <option value="createdAt">Sắp xếp theo Ngày tạo</option>
                    <option value="experience">Sắp xếp theo Kinh nghiệm (năm)</option>
                    <option value="specialization">Sắp xếp theo Chuyên khoa</option>
                    <!-- <option value="createdAt">Sắp xếp theo Ngày tạo</option> -->
                </select>
            </div>
            <div class="col-md-4">
                <select class="form-control" id="sortOrder">
                    <option value="asc">Tăng dần</option>
                    <option value="desc">Giảm dần</option>
                </select>
            </div>
        </div>

        <div id="doctorsList">
            <!-- Doctors will be populated by JavaScript -->
        </div>
        <div id="paginationControls" class="d-flex justify-content-center mt-3 hidden">
            <button id="prevPage" class="btn btn-primary me-2">Trang trước</button>
            <span id="currentPage" class="align-self-center"></span>
            <button id="nextPage" class="btn btn-primary ms-2">Trang sau</button>
        </div>
    </div>
    </div>

    <!-- JavaScript -->
    <?php require_once(__DIR__ . '/../template/scripts.php'); ?>
    <script>
        <?php if (isset($_SESSION['user_session']) && $_SESSION['user_session']['role'] === 'admin'): ?>
            document.getElementById("doctorFormElement").addEventListener("submit", function(e) {
                e.preventDefault();

                // Lấy nút được bấm
                const clickedButton = document.activeElement;
                const action = clickedButton.value; // "create" hoặc "update"

                // Thu thập dữ liệu như bạn đã có
                const userId = document.getElementById("userId").value;
                const specialization = document.getElementById("specialization").value;
                const experience = parseInt(document.getElementById("experience").value);
                const qualifications = document.getElementById("qualifications").value.split(',').map(q => q.trim());
                const date = document.getElementById("availabilityDate").value;
                const startTime = document.getElementById("startTime").value;
                const endTime = document.getElementById("endTime").value;

                const availability = [{
                    day: date,
                    slots: [{
                        startTime,
                        endTime
                    }]
                }];

                const requestPayload = {
                    userId,
                    specialization,
                    experience,
                    qualifications,
                    availability
                };

                let url = '';
                if (action === 'create') {
                    url = '/doctors/create';
                } else if (action === 'update') {
                    url = '/doctors/update';
                }

                fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(requestPayload)
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Server response:', data);
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            });
        <?php endif ?>

        document.addEventListener('DOMContentLoaded', function() {
            const specializationSelect = document.getElementById('specializationFilter');
            const sortBySelect = document.getElementById('sortBy');
            const sortOrderSelect = document.getElementById('sortOrder');
            const doctorsList = document.getElementById('doctorsList');
            const prevPageBtn = document.getElementById('prevPage');
            const nextPageBtn = document.getElementById('nextPage');
            const currentPageText = document.getElementById('currentPage');

            let currentPage = 1;
            const limit = 5; // số bác sĩ trên mỗi trang

            // Gọi lại API khi bộ lọc thay đổi
            specializationSelect.addEventListener('change', () => {
                currentPage = 1;
                fetchDoctors();
            });
            sortBySelect.addEventListener('change', () => {
                currentPage = 1;
                fetchDoctors();
            });
            sortOrderSelect.addEventListener('change', () => {
                currentPage = 1;
                fetchDoctors();
            });

            prevPageBtn.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    fetchDoctors();
                }
            });

            nextPageBtn.addEventListener('click', () => {
                currentPage++;
                fetchDoctors();
            });

            async function fetchDoctors() {
                const specialization = specializationSelect.value;
                const sortBy = sortBySelect.value;
                const sortOrder = sortOrderSelect.value;

                const requestBody = {
                    specialization: specialization || null,
                    page: currentPage,
                    limit: limit,
                    sortBy: sortBy,
                    sortOrder: sortOrder
                };

                try {
                    const response = await fetch('<?php echo getenv('API_AJAX_URL') ?>/api/doctor/findDoctors', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(requestBody)
                    });

                    if (!response.ok) throw new Error('Lỗi khi gọi API');

                    const data = await response.json();
                    if (data.error && !data.success) throw new Error(data.error);

                    const doctors = data.doctors || [];
                    const pagination = data.pagination || {};

                    renderDoctors(doctors);
                    updatePagination(pagination);
                    togglePagination(doctors.length > 0);
                } catch (error) {
                    console.error('Error fetching doctors:', error);
                    doctorsList.innerHTML = '<p class="text-danger">Không thể tải dữ liệu bác sĩ.</p>';
                    togglePagination(false);
                }
            }

            // Hàm ẩn/hiện thanh phân trang
            function togglePagination(totalCount) {
                const paginationControls = document.getElementById('paginationControls');
                if (!paginationControls) return;

                if (totalCount > 0) {
                    paginationControls.classList.remove('hidden');
                } else {
                    paginationControls.classList.add('hidden');
                }
            }


            async function renderDoctors(doctors) {
                if (!doctors.length) {
                    doctorsList.innerHTML = '<p>Không có bác sĩ phù hợp.</p>';
                    return;
                }

                // Process each doctor and fetch user details
                const doctorCards = await Promise.all(doctors.map(async (doctor) => {
                    let fullName = doctor.fullName;

                    // Fetch user service to get first name and last name if fullName is not available
                    if (!fullName && doctor.userId) {
                        try {
                            const userResponse = await fetch(`<?php echo getenv('API_AJAX_URL') ?>/api/user/getUserInternal/${doctor.userId}`, {
                                method: 'GET',
                                headers: {
                                    'x-service-token': 'service-secret-token-123'
                                }
                            });
                            if (userResponse.ok) {
                                const userData = await userResponse.json();
                                //console.log(userData);
                                // Create fullname from first name and last name
                                fullName = `${userData.user.firstName || ''} ${userData.user.lastName || ''}`.trim();
                            }
                        } catch (error) {
                            console.error('Error fetching user data:', error);
                        }
                    }

                    // Fallback if still no name
                    const name = fullName || `#${doctor.userId.slice(0, 8)}`;
                    const specialization = doctor.specialization || 'Không rõ';
                    const experience = doctor.experience ?? 'N/A';
                    const qualifications = doctor.qualifications?.join(', ') || 'Chưa cập nhật';

                    // Add button that directs to show/doctorId (show details)
                    return `
            <div class="card mb-2">
                <div class="card-body">
                    <h5 class="card-title text-primary">Bác sĩ: ${name}</h5>
                    <p class="card-text">
                        Chuyên khoa: ${specialization}<br>
                        Kinh nghiệm: ${experience} năm<br>
                        Bằng cấp: ${qualifications}
                    </p>
                    <a href="/doctors/show/${doctor.userId}" class="btn btn-primary btn-sm">
                        Xem chi tiết
                    </a>
                     <a href="/doctors/schedule/${doctor.userId}" class="btn btn-success btn-sm">
                        Đặt lịch hẹn
                    </a>
                    <?php if (isset($_SESSION['user_session']) && ($_SESSION['user_session']['role'] === 'admin' || $_SESSION['user_session']['role'] === 'employee')): ?>
                     <a href="/doctors/update/${doctor.userId}" class="btn btn-secondary btn-sm ">
                        Cập nhật hồ sơ
                    </a>
                    <?php endif ?>
                    <?php if (isset($_SESSION['user_session']) && $_SESSION['user_session']['role'] === 'admin'): ?>
                    <a href="/doctors/delete/${doctor.userId}" class="btn btn-danger btn-sm">
                        Xóa hồ sơ
                    </a>
                    <?php endif ?>
                </div>
            </div>
        `;
                }));

                doctorsList.innerHTML = doctorCards.join('');
            }

            function updatePagination(pagination) {
                if (!pagination) return;

                const totalPages = pagination.totalPages || 1;
                const currentPageNumber = pagination.currentPage || 1;

                currentPageText.textContent = `Trang ${currentPageNumber} / ${totalPages}`;

                prevPageBtn.disabled = currentPageNumber <= 1;
                nextPageBtn.disabled = currentPageNumber >= totalPages;
            }

            fetchDoctors(); // Gọi API ban đầu
        });
    </script>

</body>

</html>