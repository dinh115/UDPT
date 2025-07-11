<?php
require_once(__DIR__ . '/../template/header.php');
?>

<body class="d-flex flex-column min-vh-100">
    <?php require_once(__DIR__ . '/../template/navbar.php'); ?>
    <link rel="stylesheet" href="<?= $baseUrl ?>/css/myAppointments.css">

    <main class="flex-grow-1">

        <div class="container">
            <h1>Lịch hẹn của tôi</h1>


            <div class="filters">
                <div class="filter-group">
                    <label for="status">Trạng thái:</label>
                    <select id="status">
                        <option value="">Tất cả</option>
                        <option value="pending">Đang chờ</option>
                        <option value="confirmed">Đã xác nhận</option>
                        <option value="cancelled">Đã hủy</option>
                        <option value="completed">Hoàn thành</option>
                    </select>
                </div>

                <div class="filter-group">
                    <label for="limit">Giới hạn:</label>
                    <select id="limit">
                        <option value="5">5</option>
                        <option value="10" selected>10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                    </select>
                </div>

                <!-- User ID search for admin/employee -->
                <div class="filter-group" id="userSearchGroup" style="display: none;">
                    <label for="userId">User ID:</label>
                    <input type="text" id="userId" placeholder="Nhập user ID để search">
                </div>

                <!-- Doctor ID search for admin/employee -->
                <div class="filter-group" id="doctorSearchGroup" style="display: none;">
                    <label for="doctorId">Doctor ID:</label>
                    <input type="text" id="doctorId" placeholder="Nhập doctor ID để search">
                </div>

                <button class="btn" onclick="loadAppointments(1)">Áp dụng</button>
            </div>

            <div class="table-container">
                <div id="loading" class="loading" style="display: none;">
                    Loading...
                </div>

                <div id="error" class="error" style="display: none;"></div>

                <table id="appointmentsTable" style="display: none;">
                    <thead>
                        <tr>
                            <th>ID Lịch hẹn</th>
                            <th>Bác sĩ</th>
                            <th>Bệnh nhân</th>
                            <th>Ngày</th>
                            <th>Thời gian</th>
                            <th>Trạng thái</th>
                            <th>Ghi chú</th>
                            <th>Thời gian tạo</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody id="appointmentsBody">
                    </tbody>
                </table>

                <div id="noData" class="no-data" style="display: none;">
                    Không tìm thấy lịch hẹn.
                </div>
            </div>

            <div id="pagination" class="pagination" style="display: none;"></div>
        </div>
    </main>

    <!-- Notes Edit Modal -->
    <div id="notesModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Chỉnh sửa ghi chú</h3>
                <span class="close" onclick="closeNotesModal()">&times;</span>
            </div>
            <div class="modal-body">
                <label for="notesTextarea">Ghi chú:</label>
                <textarea id="notesTextarea" placeholder="Nhập ghi chú cho cuộc hẹn..."></textarea>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="closeNotesModal()">Hủy</button>
                <button class="btn-save" id="saveNotesBtn" onclick="saveNotes()">Lưu</button>
            </div>
        </div>
    </div>

    <?php require_once(__DIR__ . '/../template/footer.php'); ?>
    <?php require_once(__DIR__ . '/../template/scripts.php'); ?>

    <script>
        let currentPage = 1;
        let totalPages = 1;
        let isLoading = false;
        let currentEditingAppointmentId = null;

        // Simulated user session - replace with actual session data
        const userSession = {
            role: '<?php echo $_SESSION["user_session"]["role"] ?>',
            userId: '<?php echo $_SESSION["user_session"]["user"]["id"] ?>'
        };

        // Initialize on page load
        document.addEventListener('DOMContentLoaded', function() {
            initializeFilters();
            loadAppointments(1);
            initializeModalEvents();
        });

        // Initialize modal events
        function initializeModalEvents() {
            // Close modal when clicking outside
            window.onclick = function(event) {
                const modal = document.getElementById('notesModal');
                if (event.target === modal) {
                    closeNotesModal();
                }
            };
        }

        // Initialize filters based on user role
        function initializeFilters() {
            const doctorSearchGroup = document.getElementById('doctorSearchGroup');
            const userSearchGroup = document.getElementById('userSearchGroup');

            // Show doctor search for admin/employee
            if (userSession.role === 'admin' || userSession.role === 'employee') {
                doctorSearchGroup.style.display = 'flex';
                userSearchGroup.style.display = 'flex';
            }
        }
        // Load appointments from API
        async function loadAppointments(page = 1) {
            if (isLoading) return;

            isLoading = true;
            showLoading();

            try {
                const status = document.getElementById('status').value;
                const limit = document.getElementById('limit').value;
                const userId = document.getElementById('userId').value;
                const doctorId = document.getElementById('doctorId').value;

                // Tạo body
                const requestBody = {
                    page: page,
                    limit: limit
                };

                if (status) {
                    requestBody.status = status;
                }

                // Chỉ thêm doctorId nếu là admin/employee và có doctorId
                if (doctorId && (userSession.role === 'admin' || userSession.role === 'employee')) {
                    requestBody.doctorId = doctorId;
                }

                // Chỉ thêm userId nếu là admin/employee và có userId
                if (userId && (userSession.role === 'admin' || userSession.role === 'employee')) {
                    requestBody.userId = userId;
                }

                const response = await fetch(`<?php echo getenv('API_AJAX_URL'); ?>/api/appointment/GetMyAppointments`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer <?php echo $_SESSION['user_session']['token']; ?>'
                    },
                    body: JSON.stringify(requestBody)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (data.success) {
                    displayAppointments(data.appointments);
                    updatePagination(data.pagination);
                    currentPage = page;
                    totalPages = data.pagination.totalPages;
                } else {
                    showError(data.error || 'Failed to load appointments');
                }

            } catch (error) {
                console.error('Error loading appointments:', error);
                showError('Tải dữ liệu lịch hẹn thất bại. Vui lòng thử lại.');
            } finally {
                isLoading = false;
                hideLoading();
            }
        }

        // Display appointments in table
        async function displayAppointments(appointments) {
            const tbody = document.getElementById('appointmentsBody');
            tbody.innerHTML = '';

            if (!appointments || appointments.length === 0) {
                showNoData();
                return;
            }

            for (const appointment of appointments) {
                const row = document.createElement('tr');

                const doctorId = appointment.doctorId;
                let fullNameDoctor = '';
                // Nếu không có fullName doctor thì gọi API để lấy từ userId
                if (!fullNameDoctor && doctorId) {
                    try {
                        const userResponse = await fetch(`<?php echo getenv('API_AJAX_URL') ?>/api/user/getUserInternal/${doctorId}`, {
                            method: 'GET',
                            headers: {
                                'x-service-token': 'service-secret-token-123'
                            }
                        });

                        if (userResponse.ok) {
                            const userData = await userResponse.json();
                            // Tạo fullname từ firstName + lastName
                            fullNameDoctor = `${userData.user.firstName || ''} ${userData.user.lastName || ''}`.trim();
                        }
                    } catch (error) {
                        console.error('Error fetching user data:', error);
                    }
                }

                // Fallback nếu không có tên vẫn
                const doctorName = fullNameDoctor || (doctorId ? `#${doctorId.slice(0, 8)}` : 'Không rõ');

                // 
                const patientId = appointment.patientId;
                let fullNamePatient = '';
                // Nếu không có fullName user thì gọi API để lấy từ userId
                if (patientId) {
                    try {
                        const userResponse = await fetch(`<?php echo getenv('API_AJAX_URL') ?>/api/user/getUserInternal/${patientId}`, {
                            method: 'GET',
                            headers: {
                                'x-service-token': 'service-secret-token-123'
                            }
                        });

                        if (userResponse.ok) {
                            const userData = await userResponse.json();
                            // Tạo fullname từ firstName + lastName
                            fullNamePatient = `${userData.user.firstName || ''} ${userData.user.lastName || ''}`.trim();
                        }
                    } catch (error) {
                        console.error('Error fetching user data:', error);
                    }
                }

                // Fallback nếu không có tên vẫn
                const patientName = fullNamePatient || (patientId ? `#${patientId.slice(0, 8)}` : 'Không rõ');
                // Determine action buttons based on user role and appointment status
                let actionButtons = '';

                let notesHTML;
                const appointmentDateTime = new Date(appointment.appointmentDate);
                const nowPlus1Hour = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);

                const isEditable = userSession.role === 'patient' && appointment.status === 'pending';

                if (isEditable) {
                    notesHTML = `
        <div class="note-wrapper editable-note" onclick="editNotes('${appointment.id}', '${(appointment.notes || '').replace(/'/g, "&#39;")}')">
            ${appointment.notes || 'No notes'}
            <i class="fas fa-pen edit-icon"></i>
        </div>
    `;
                } else {
                    notesHTML = `
        <div class="note-wrapper">${appointment.notes || 'No notes'}</div>
    `;
                }


                if (userSession.role === 'patient') {
                    if (appointment.status === 'pending') {
                        actionButtons = `
                            <button class="btn-cancel" onclick="cancelAppointment('${appointment.id}')">Hủy</button>                        `;
                    }
                } else if (['doctor', 'admin', 'employee'].includes(userSession.role)) {
                    if (appointment.status === 'pending') {
                        actionButtons = `
                            <button class="btn-accept" onclick="acceptAppointment('${appointment.id}')">Chấp nhận</button>
                        `;
                    }
                    else if (appointment.status === 'confirmed'){
                        const appointmentDateTime = new Date(appointment.appointmentDate);
                        const nowPlus1Hour = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);

                        if (appointmentDateTime <= nowPlus1Hour) {
                            actionButtons = `
                                <a href="/patients/createPatientVisit?patientId=${appointment.patientId}&doctorId=${appointment.doctorId}" class="btn btn-sm btn-success mt-1">
                                    <i class="fas fa-file-medical"></i> Tạo phiếu khám
                                </a>
                            `;
                        }
                    }
                }

                row.innerHTML = `
    <td>${appointment.id}</td>
    <td>${doctorName}</td>
    <td>${patientName}</td>
    <td class="appointment-date">${formatDate(appointment.appointmentDate)}</td>
    <td class="time-slot">${appointment.timeSlot.startTime} - ${appointment.timeSlot.endTime}</td>
    <td><span class="status ${appointment.status}">${appointment.status}</span></td>
    <td class="notes">${notesHTML}</td>
    <td>${formatTimestamp(appointment.createdAt)}</td>
    <td>${actionButtons}</td>
`;
                tbody.appendChild(row);
            }

            showTable();
        }

        // Edit notes function
        function editNotes(appointmentId, currentNotes) {
            currentEditingAppointmentId = appointmentId;
            document.getElementById('notesTextarea').value = currentNotes.replace(/&#39;/g, "'");
            document.getElementById('notesModal').style.display = 'block';
        }

        // Close notes modal
        function closeNotesModal() {
            document.getElementById('notesModal').style.display = 'none';
            currentEditingAppointmentId = null;
            document.getElementById('notesTextarea').value = '';
        }

        // Save notes function
        async function saveNotes() {
            if (!currentEditingAppointmentId) return;

            const saveBtn = document.getElementById('saveNotesBtn');
            const notesTextarea = document.getElementById('notesTextarea');
            const newNotes = notesTextarea.value.trim();

            try {
                // Disable button and show loading state
                saveBtn.disabled = true;
                saveBtn.textContent = 'Đang lưu...';

                const response = await fetch(`<?php echo getenv('API_AJAX_URL') ?>/api/appointment/UpdateAppointment/${currentEditingAppointmentId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer <?php echo $_SESSION['user_session']['token']; ?>'
                    },
                    body: JSON.stringify({
                        notes: newNotes
                    })
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    alert('Ghi chú đã được cập nhật thành công!');
                    closeNotesModal();
                    // Reload current page to refresh the data
                    loadAppointments(currentPage);
                } else {
                    alert(result.error || 'Không thể cập nhật ghi chú. Vui lòng thử lại.');
                }

            } catch (error) {
                console.error('Error updating notes:', error);
                alert('Đã xảy ra lỗi khi cập nhật ghi chú. Vui lòng thử lại.');
            } finally {
                // Re-enable button
                saveBtn.disabled = false;
                saveBtn.textContent = 'Lưu';
            }
        }

        // Update pagination controls
        function updatePagination(pagination) {
            const paginationDiv = document.getElementById('pagination');
            paginationDiv.innerHTML = '';

            if (pagination.totalPages <= 1) {
                paginationDiv.style.display = 'none';
                return;
            }

            // Previous button
            const prevBtn = document.createElement('button');
            prevBtn.className = `pagination-btn ${pagination.page <= 1 ? 'disabled' : ''}`;
            prevBtn.textContent = '← Trước';
            prevBtn.onclick = () => {
                if (pagination.page > 1) {
                    loadAppointments(pagination.page - 1);
                }
            };
            paginationDiv.appendChild(prevBtn);

            // Page numbers
            const startPage = Math.max(1, pagination.page - 2);
            const endPage = Math.min(pagination.totalPages, pagination.page + 2);

            if (startPage > 1) {
                const firstBtn = document.createElement('button');
                firstBtn.className = 'pagination-btn';
                firstBtn.textContent = '1';
                firstBtn.onclick = () => loadAppointments(1);
                paginationDiv.appendChild(firstBtn);

                if (startPage > 2) {
                    const dots = document.createElement('span');
                    dots.textContent = '...';
                    dots.style.padding = '0 10px';
                    paginationDiv.appendChild(dots);
                }
            }

            for (let i = startPage; i <= endPage; i++) {
                const pageBtn = document.createElement('button');
                pageBtn.className = `pagination-btn ${i === pagination.page ? 'active' : ''}`;
                pageBtn.textContent = i;
                pageBtn.onclick = () => loadAppointments(i);
                paginationDiv.appendChild(pageBtn);
            }

            if (endPage < pagination.totalPages) {
                if (endPage < pagination.totalPages - 1) {
                    const dots = document.createElement('span');
                    dots.textContent = '...';
                    dots.style.padding = '0 10px';
                    paginationDiv.appendChild(dots);
                }

                const lastBtn = document.createElement('button');
                lastBtn.className = 'pagination-btn';
                lastBtn.textContent = pagination.totalPages;
                lastBtn.onclick = () => loadAppointments(pagination.totalPages);
                paginationDiv.appendChild(lastBtn);
            }

            // Next button
            const nextBtn = document.createElement('button');
            nextBtn.className = `pagination-btn ${pagination.page >= pagination.totalPages ? 'disabled' : ''}`;
            nextBtn.textContent = 'Sau →';
            nextBtn.onclick = () => {
                if (pagination.page < pagination.totalPages) {
                    loadAppointments(pagination.page + 1);
                }
            };
            paginationDiv.appendChild(nextBtn);

            // Pagination info
            const info = document.createElement('div');
            info.className = 'pagination-info';
            info.textContent = `Hiển thị ${Math.min((pagination.page - 1) * pagination.limit + 1, pagination.total)} đến ${Math.min(pagination.page * pagination.limit, pagination.total)} trong tổng ${pagination.total}`;
            paginationDiv.appendChild(info);

            paginationDiv.style.display = 'flex';
        }

        // Utility functions
        function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }

        function formatTimestamp(timestamp) {
            const date = new Date(timestamp.seconds * 1000);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        function showLoading() {
            document.getElementById('loading').style.display = 'block';
            document.getElementById('appointmentsTable').style.display = 'none';
            document.getElementById('error').style.display = 'none';
            document.getElementById('noData').style.display = 'none';
            document.getElementById('pagination').style.display = 'none';
        }

        function hideLoading() {
            document.getElementById('loading').style.display = 'none';
        }

        function showError(message) {
            document.getElementById('error').textContent = message;
            document.getElementById('error').style.display = 'block';
            document.getElementById('appointmentsTable').style.display = 'none';
            document.getElementById('noData').style.display = 'none';
            document.getElementById('pagination').style.display = 'none';
        }

        function showTable() {
            document.getElementById('appointmentsTable').style.display = 'table';
            document.getElementById('error').style.display = 'none';
            document.getElementById('noData').style.display = 'none';
        }

        function showNoData() {
            document.getElementById('noData').style.display = 'block';
            document.getElementById('appointmentsTable').style.display = 'none';
            document.getElementById('error').style.display = 'none';
            document.getElementById('pagination').style.display = 'none';
        }

        // Event listeners for filters
        document.getElementById('status').addEventListener('change', function() {
            loadAppointments(1);
        });

        document.getElementById('limit').addEventListener('change', function() {
            loadAppointments(1);
        });

        // Cancel appointment function
        async function cancelAppointment(appointmentId) {
            // Show confirmation dialog
            if (!confirm('Bạn có chắc chắn muốn hủy cuộc hẹn này không?')) {
                return;
            }

            try {
                // Disable the button to prevent multiple clicks
                const button = event.target;
                button.disabled = true;
                button.textContent = 'Đang hủy...';

                // Make API call to cancel appointment
                const response = await fetch(`<?php echo getenv('API_AJAX_URL') ?>/api/appointment/CancelAppointment/${appointmentId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': 'Bearer <?php echo $_SESSION['user_session']['token']; ?>'
                    },
                });

                //console.log(response);
                const result = await response.json();

                if (response.ok && result.success) {
                    // Show success message
                    alert('Cuộc hẹn đã được hủy thành công!');

                    // Reload current page to refresh the data
                    loadAppointments(currentPage);
                } else {
                    // Show error message
                    alert(result.error || 'Không thể hủy cuộc hẹn. Vui lòng thử lại.');

                    // Re-enable the button
                    button.disabled = false;
                    button.textContent = 'Hủy';
                }

            } catch (error) {
                console.error('Error canceling appointment:', error);
                alert('Đã xảy ra lỗi khi hủy cuộc hẹn. Vui lòng thử lại.');

                // Re-enable the button
                const button = event.target;
                button.disabled = false;
                button.textContent = 'Hủy';
            }
        }

        // Cancel appointment function
        async function acceptAppointment(appointmentId) {
            // Show confirmation dialog
            if (!confirm('Bạn có chắc chắn chấp nhận cuộc hẹn này không?')) {
                return;
            }

            try {
                // Disable the button to prevent multiple clicks
                const button = event.target;
                button.disabled = true;
                button.textContent = 'Đang xử lý...';

                // Make API call to cancel appointment
                const response = await fetch(`<?php echo getenv('API_AJAX_URL') ?>/api/appointment/AcceptAppointment/${appointmentId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': 'Bearer <?php echo $_SESSION['user_session']['token']; ?>'
                    },
                });

                console.log(response);
                const result = await response.json();

                if (response.ok && result.success) {
                    // APICUADAICHENVAODAYNHOXOACOMMENTSAUKHITHEM
                    // Call the new notification API
                    try {
                        const notificationResponse = await fetch(`<?php echo getenv('API_AJAX_URL') ?>/api/notification/AcceptAppointment`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer <?php echo $_SESSION['user_session']['token']; ?>'
                            },
                            body: JSON.stringify({ appointmentId: appointmentId })
                        });
                        const notificationResult = await notificationResponse.json();
                        console.log('Notification API response:', notificationResult);
                    } catch (notificationError) {
                        console.error('Error calling Notification API:', notificationError);
                    }

                    // Call the new analysis API
                    try {
                        const analysisResponse = await fetch(`<?php echo getenv('API_AJAX_URL') ?>/api/analysis/AcceptAppointment`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer <?php echo $_SESSION['user_session']['token']; ?>'
                            },
                            body: JSON.stringify({ appointmentId: appointmentId })
                        });
                        const analysisResult = await analysisResponse.json();
                        console.log('Analysis API response:', analysisResult);
                    } catch (analysisError) {
                        console.error('Error calling Analysis API:', analysisError);
                    }
                    // End of new API calls
                    alert('Cuộc hẹn đã được chấp nhận thành công!');
                    loadAppointments(currentPage);
                } else {
                    // Lấy lỗi từ backend nếu có, fallback về statusText
                    alert(result.message || response.statusText || 'Không thể chấp nhận cuộc hẹn. Vui lòng thử lại.');
                    console.error(result.message || response.statusText);
                    button.disabled = false;
                    button.textContent = 'Chấp nhận';
                }


            } catch (error) {
                console.error('Error accepting appointment:', error);
                alert('Đã xảy ra lỗi khi chấp nhận cuộc hẹn. Vui lòng thử lại.');

                // Re-enable the button
                const button = event.target;
                button.disabled = false;
                button.textContent = 'Chấp nhận';
            }
        }
    </script>
</body>

</html>

<?php
