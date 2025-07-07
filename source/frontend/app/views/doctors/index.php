<?php require_once(__DIR__ . '/../template/header.php'); ?>


<body>

    <?php require_once(__DIR__ . '/../template/navbar.php'); ?>

    <!-- Hero Section -->
    <section class="hero-section">
        <div class="container">
            <div class="hero-content">
                <h1 class="hero-title">MedPortal - Bác sĩ</h1>
                <p class="hero-subtitle">Các chức năng liên quan đến bác sĩ</p>

            </div>
        </div>
    </section>

    <div class="container">
        <!-- Dashboard Grid -->
        <div class="dashboard-grid">

            <!-- Quick Actions -->
            <div class="quick-actions">

                <a href="/appointments/schedule" class="action-btn">
                    <i class="fa fa-plus" aria-hidden="true"></i>
                    <span>Tạo hồ sơ bác sĩ</span>
                </a>
                <a href="/appointments/my" class="action-btn">
                    <i class="fa fa-pencil" aria-hidden="true"></i>
                    <span>Cập nhật hồ sơ bác sĩ</span>
                </a>
            </div>
        </div>
    </div>
    <!-- Doctor Form -->
    <div class="dashboard-card slide-up" id="doctorForm">
        <div class="card-header">
            <div class="card-icon">
                <i class="fas fa-user-md"></i>
            </div>
            <div>
                <h3 class="card-title">Hồ Sơ Bác Sĩ (ADMIN ONLY)</h3>
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
                        <option value="Neurology">Thần kinh</option>
                        <option value="Orthopedics">Chỉnh hình</option>
                        <option value="Pediatrics">Nhi khoa</option>
                        <option value="Dermatology">Da liễu</option>
                        <option value="General Medicine">Y học tổng quát</option>
                        <option value="Surgery">Phẫu thuật</option>
                        <option value="Oncology">Ung thư</option>
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
                    <input type="text" class="form-control" id="qualifications" placeholder="MBBS, MD, PhD (comma separated)">
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


    <!-- Doctor Form -->
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
                    <option value="Cardiology">Tim mạch</option>
                    <option value="Neurology">Thần kinh</option>
                    <option value="Orthopedics">Chỉnh hình</option>
                    <option value="Pediatrics">Nhi khoa</option>
                    <option value="Dermatology">Da liễu</option>
                    <option value="General Medicine">Y học tổng quát</option>
                    <option value="Surgery">Phẫu thuật</option>
                    <option value="Oncology">Ung thư</option>
                </select>
            </div>
            <div class="col-md-4">
                <select class="form-control" id="sortBy">
                    <option value="name">Sắp xếp theo Tên</option>
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
            <!-- Gọi thẳng API Gateway -->
        </div>
        <div id="paginationControls" class="d-flex justify-content-center mt-3 hidden">
            <button id="prevPage" class="btn btn-secondary me-2">Trang trước</button>
            <span id="currentPage" class="align-self-center"></span>
            <button id="nextPage" class="btn btn-secondary ms-2">Trang sau</button>
        </div>
    </div>
    </div>

    <!-- JavaScript -->
    <?php require_once(__DIR__ . '/../template/scripts.php'); ?>
    <script>
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
                    const response = await fetch('https://your-api-gateway/findDoctors', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(requestBody)
                    });

                    if (!response.ok) throw new Error('Lỗi khi gọi API');

                    const data = await response.json();
                    const doctors = data.doctors || [];
                    const totalCount = data.total || 0;

                    renderDoctors(doctors);
                    updatePagination(totalCount);
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


            function renderDoctors(doctors) {
                if (!doctors.length) {
                    doctorsList.innerHTML = '<p>Không có bác sĩ phù hợp.</p>';
                    return;
                }

                doctorsList.innerHTML = doctors.map(doctor => `
            <div class="card mb-2">
                <div class="card-body">
                    <h5 class="card-title">${doctor.name}</h5>
                    <p class="card-text">
                        Chuyên khoa: ${doctor.specialization}<br>
                        Kinh nghiệm: ${doctor.experience} năm
                    </p>
                </div>
            </div>
        `).join('');
            }

            function updatePagination(total) {
                const totalPages = Math.ceil(total / limit);
                currentPageText.textContent = `Trang ${currentPage} / ${totalPages}`;

                prevPageBtn.disabled = currentPage <= 1;
                nextPageBtn.disabled = currentPage >= totalPages;
            }

            fetchDoctors(); // Gọi API ban đầu
        });
    </script>

</body>

</html>