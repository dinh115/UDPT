<?php
require_once(__DIR__ . '/../template/header.php');
?>

<body class="d-flex flex-column min-vh-100">
    <?php require_once(__DIR__ . '/../template/navbar.php'); ?>
    <link rel="stylesheet" href="<?= $baseUrl ?>/css/showDoctor.css">

    <main class="flex-grow-1">

        <div class="mt-5">
            <div class="row justify-content-center">
                <div class="col-lg-10">
                    <div class="dashboard-card">
                        <div class="card-header">
                            <div class="card-icon">
                                <i class="fas fa-user-md"></i>
                            </div>
                            <div>
                                <h3 class="card-title">Thông tin Bác sĩ</h3>
                                <p class="card-subtitle">Chi tiết hồ sơ bác sĩ và lịch khám</p>
                            </div>
                        </div>

                        <?php if (isset($doctor) && $doctor): ?>
                            <?php
                            // Get doctor's full name
                            $doctorName = getDoctorName($doctor);
                            ?>

                            <!-- Doctor Name Header -->
                            <div class="info-section">
                                <div class="doctor-name-header">
                                    <h2 class="doctor-name">
                                        <i class="fas fa-user-md"></i>
                                        Bác sĩ: <?php echo htmlspecialchars($doctorName); ?>
                                    </h2>
                                </div>
                            </div>

                            <!-- Basic Information -->
                            <div class="info-section">
                                <h4 class="section-title">
                                    <i class="fas fa-info-circle"></i>
                                    Thông tin cơ bản
                                </h4>

                                <div class="info-item">
                                    <span class="info-label">ID:</span>
                                    <span class="info-value"><?php echo htmlspecialchars($doctor['id']); ?></span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">User ID:</span>
                                    <span class="info-value"><?php echo htmlspecialchars($doctor['userId']); ?></span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Chuyên khoa:</span>
                                    <span class="info-value"><?php echo htmlspecialchars($doctor['specialization']); ?></span>
                                </div>

                                <div class="info-item">
                                    <span class="info-label">Kinh nghiệm:</span>
                                    <span class="info-value"><?php echo htmlspecialchars($doctor['experience']); ?> năm</span>
                                </div>

                                <?php if (isset($_SESSION['user_session']) && $_SESSION['user_session']['role'] === 'admin'): ?>

                                    <div class="info-item">
                                        <span class="info-label">Ngày tạo:</span>
                                        <span class="info-value"><?php echo formatTimestamp($doctor['createdAt']); ?></span>
                                    </div>

                                    <div class="info-item">
                                        <span class="info-label">Cập nhật:</span>
                                        <span class="info-value"><?php echo formatTimestamp($doctor['updatedAt']); ?></span>
                                    </div>
                            </div>
                        <?php endif ?>


                        <!-- Qualifications -->
                        <?php if (isset($doctor['qualifications']) && !empty($doctor['qualifications'])): ?>
                            <div class="info-section">
                                <h4 class="section-title">
                                    <i class="fas fa-graduation-cap"></i>
                                    Bằng cấp & Chứng chỉ
                                </h4>
                                <div>
                                    <?php foreach ($doctor['qualifications'] as $qualification): ?>
                                        <span class="qualification-item">
                                            <i class="fas fa-certificate"></i>
                                            <?php echo htmlspecialchars($qualification); ?>
                                        </span>
                                    <?php endforeach; ?>
                                </div>
                            </div>
                        <?php endif; ?>

                        <!-- Availability -->
                        <?php if (isset($doctor['availability']) && !empty($doctor['availability'])): ?>
                            <div class="info-section">
                                <h4 class="section-title">
                                    <i class="fas fa-calendar-alt"></i>
                                    Lịch khám
                                </h4>

                                <?php foreach ($doctor['availability'] as $dayAvailability): ?>
                                    <div class="availability-day">
                                        <div class="day-header">
                                            <i class="fas fa-calendar-day"></i>
                                            <?php echo translateDay($dayAvailability['day']); ?>
                                        </div>

                                        <?php if (isset($dayAvailability['slots']) && !empty($dayAvailability['slots'])): ?>
                                            <div class="time-slots">
                                                <?php foreach ($dayAvailability['slots'] as $slot): ?>
                                                    <div class="time-slot <?php echo $slot['isBooked'] ? 'booked' : ''; ?>">
                                                        <i class="fas fa-clock"></i>
                                                        <?php echo $slot['startTime'] . ' - ' . $slot['endTime']; ?>
                                                        <?php if ($slot['isBooked']): ?>
                                                            <i class="fas fa-times-circle ms-1"></i>
                                                        <?php else: ?>
                                                            <i class="fas fa-check-circle ms-1"></i>
                                                        <?php endif; ?>
                                                    </div>
                                                <?php endforeach; ?>
                                            </div>
                                        <?php else: ?>
                                            <div class="no-slots">Không có lịch khám trong ngày này</div>
                                        <?php endif; ?>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                        <?php endif; ?>

                        <!-- Action Buttons -->
                        <div class="action-buttons">
                            <?php if (isset($_SESSION['user_session']) && ($_SESSION['user_session']['role'] === 'admin' || $isProfileOwner)): ?>

                                <a href="/doctors/update/<?php echo $doctor['id']; ?>" class="btn-custom btn-update">
                                    <i class="fas fa-edit"></i>
                                    Cập nhật
                                </a>
                            <?php endif ?>
                            <?php if (isset($_SESSION['user_session']) && $_SESSION['user_session']['role'] === 'admin'): ?>

                                <a class="btn-custom btn-delete" onclick="deleteDoctor('<?php echo $doctor['id']; ?>', '<?php echo $doctorName ?>')">
                                    <i class="fas fa-trash"></i>
                                    Xóa hồ sơ
                                </a>
                            <?php endif ?>
                            <?php if (isset($_SESSION['user_session']) && !$isProfileOwner): ?>
                                <button id="scheduleNow" class="btn-custom btn-appointment" onclick="showBookingForm()">
                                    <i class="fas fa-calendar-plus"></i>
                                    Đặt lịch hẹn
                                </button>
                            <?php endif ?>
                        </div>

                    <?php else: ?>
                        <div class="alert alert-warning text-center">
                            <i class="fas fa-exclamation-triangle"></i>
                            Không tìm thấy thông tin bác sĩ.
                        </div>
                    <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>

        <!-- Booking Form Modal -->
        <div id="bookingModal" class="modal" style="display: none;">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-calendar-plus"></i> Đặt lịch hẹn với <?php echo htmlspecialchars($doctorName); ?></h3>
                    <span class="close" onclick="closeBookingForm()">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="bookingForm">
                        <!-- Patient ID -->
                        <div class="form-group">
                            <label for="patientId">
                                <i class="fas fa-user"></i> Mã bệnh nhân:
                            </label>
                            <input type="text" id="patientId" name="patientId"
                                value="<?php echo htmlspecialchars($_SESSION['user_session']['user']['id'] ?? ''); ?>"
                                <?php if (!isset($_SESSION['user_session']) || ($_SESSION['user_session']['role'] !== 'admin' && $_SESSION['user_session']['role'] !== 'employee')): ?>readonly<?php endif; ?>>
                        </div>

                        <!-- Date Selection -->
                        <div class="form-group">
                            <label for="appointmentDate">
                                <i class="fas fa-calendar"></i> Ngày khám:
                            </label>
                            <input type="date" id="appointmentDate" name="appointmentDate"
                                min="<?php echo date('Y-m-d'); ?>"
                                max="<?php echo date('Y-m-d', strtotime('+1 week')); ?>"
                                required>
                        </div>

                        <!-- Time Slot Selection -->
                        <div class="form-group">
                            <label>
                                <i class="fas fa-clock"></i> Khung giờ khám:
                            </label>
                            <div id="timeSlotSelection">
                                <!-- Time slots will be populated based on selected date -->
                            </div>
                        </div>

                        <!-- Notes -->
                        <div class="form-group">
                            <label for="notes">
                                <i class="fas fa-sticky-note"></i> Ghi chú:
                            </label>
                            <textarea id="notes" name="notes" rows="4" placeholder="Nhập ghi chú (tùy chọn)..."></textarea>
                        </div>

                        <!-- Submit Button -->
                        <div class="form-actions">
                            <button type="button" class="btn-cancel" onclick="closeBookingForm()">
                                <i class="fas fa-times"></i> Hủy
                            </button>
                            <button type="submit" class="btn-submit">
                                <i class="fas fa-check"></i> Đặt lịch
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- Loading Overlay -->
        <div id="loadingOverlay" class="loading-overlay" style="display: none;">
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Đang xử lý...</p>
            </div>
        </div>
    </main>

    <?php require_once(__DIR__ . '/../template/footer.php'); ?>
    <?php require_once(__DIR__ . '/../template/scripts.php'); ?>

    <style>
        /* Modal Styles */
        .modal {
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .modal-content {
            background-color: #fff;
            border-radius: 8px;
            width: 90%;
            max-width: 600px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid #eee;
            background-color: #f8f9fa;
        }

        .modal-header h3 {
            margin: 0;
            color: #333;
        }

        .close {
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
            color: #aaa;
        }

        .close:hover {
            color: #000;
        }

        .modal-body {
            padding: 20px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: bold;
            color: #333;
        }

        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
        }

        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }

        .form-group input[readonly] {
            background-color: #f8f9fa;
            cursor: not-allowed;
        }

        #timeSlotSelection {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 10px;
            margin-top: 10px;
        }

        .time-slot-option {
            padding: 10px;
            border: 2px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
            text-align: center;
            transition: all 0.3s ease;
            background-color: #fff;
        }

        .time-slot-option:hover {
            border-color: #007bff;
            background-color: #f8f9fa;
        }

        .time-slot-option.selected {
            border-color: #007bff;
            background-color: #007bff;
            color: white;
        }

        .time-slot-option.unavailable {
            background-color: #f8f9fa;
            color: #999;
            cursor: not-allowed;
            opacity: 0.6;
        }

        .form-actions {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
            margin-top: 20px;
        }

        .btn-cancel,
        .btn-submit {
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s ease;
        }

        .btn-cancel {
            background-color: #6c757d;
            color: white;
        }

        .btn-cancel:hover {
            background-color: #5a6268;
        }

        .btn-submit {
            background-color: #007bff;
            color: white;
        }

        .btn-submit:hover {
            background-color: #0056b3;
        }

        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1001;
        }

        .loading-spinner {
            text-align: center;
            color: white;
        }

        .loading-spinner i {
            font-size: 2rem;
            margin-bottom: 10px;
        }

        .no-slots-message {
            text-align: center;
            color: #6c757d;
            font-style: italic;
            padding: 20px;
        }
    </style>

    <script>
        // Doctor availability data
        const doctorAvailability = <?php echo json_encode($doctor['availability'] ?? []); ?>;
        let selectedTimeSlot = null;

        // Show booking form
        function showBookingForm() {
            document.getElementById('bookingModal').style.display = 'flex';

            // Set default date to today
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('appointmentDate').value = today;

            // Load time slots for today
            loadTimeSlots(today);
        }

        // Close booking form
        function closeBookingForm() {
            document.getElementById('bookingModal').style.display = 'none';
            document.getElementById('bookingForm').reset();
            selectedTimeSlot = null;
        }

        // Load time slots based on selected date
        function loadTimeSlots(selectedDate) {
            const timeSlotContainer = document.getElementById('timeSlotSelection');
            timeSlotContainer.innerHTML = '';

            // Get day of week from selected date
            const date = new Date(selectedDate);
            const dayOfWeek = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'][date.getDay()];

            // Find availability for this day
            const dayAvailability = doctorAvailability.find(day => day.day === dayOfWeek);

            if (!dayAvailability || !dayAvailability.slots || dayAvailability.slots.length === 0) {
                timeSlotContainer.innerHTML = '<div class="no-slots-message">Bác sĩ không có lịch khám vào ngày này</div>';
                return;
            }

            // Create time slot options
            dayAvailability.slots.forEach((slot, index) => {
                const slotDiv = document.createElement('div');
                slotDiv.className = `time-slot-option ${slot.isBooked ? 'unavailable' : ''}`;
                slotDiv.innerHTML = `
                    <i class="fas fa-clock"></i><br>
                    ${slot.startTime} - ${slot.endTime}
                    ${slot.isBooked ? '<br><small>Đã được đặt</small>' : ''}
                `;

                if (!slot.isBooked) {
                    slotDiv.onclick = () => selectTimeSlot(slotDiv, slot);
                }

                timeSlotContainer.appendChild(slotDiv);
            });
        }

        // Select time slot
        function selectTimeSlot(element, slot) {
            // Remove previous selection
            document.querySelectorAll('.time-slot-option.selected').forEach(el => {
                el.classList.remove('selected');
            });

            // Add selection to clicked element
            element.classList.add('selected');
            selectedTimeSlot = slot;
        }

        // Handle date change
        document.getElementById('appointmentDate').addEventListener('change', function() {
            const selectedDate = this.value;
            if (selectedDate) {
                loadTimeSlots(selectedDate);
            }
        });

        // Handle form submission
        document.getElementById('bookingForm').addEventListener('submit', async function(e) {
            e.preventDefault();

            // Validate required fields
            const patientId = document.getElementById('patientId').value.trim();
            const appointmentDate = document.getElementById('appointmentDate').value;
            const notes = document.getElementById('notes').value.trim();

            if (!patientId) {
                alert('Vui lòng nhập mã bệnh nhân');
                return;
            }

            if (!appointmentDate) {
                alert('Vui lòng chọn ngày khám');
                return;
            }

            if (!selectedTimeSlot) {
                alert('Vui lòng chọn khung giờ khám');
                return;
            }

            // Show loading
            document.getElementById('loadingOverlay').style.display = 'flex';

            try {
                // Prepare request data
                const requestData = {
                    doctorId: '<?php echo $doctor['userId'] ?? ''; ?>',
                    appointmentDate: appointmentDate,
                    timeSlot: selectedTimeSlot,
                    notes: notes
                };

                console.log(requestData);

                // Add patientId for admin and employee
                <?php if (isset($_SESSION['user_session']) && ($_SESSION['user_session']['role'] === 'admin' || $_SESSION['user_session']['role'] === 'employee')): ?>
                    requestData.patientId = patientId;
                <?php endif; ?>

                // Make API request
                const response = await fetch('<?php echo getenv('API_AJAX_URL'); ?>/api/appointment/BookAppointment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer <?php echo $_SESSION['user_session']['token']; ?>'
                    },
                    body: JSON.stringify(requestData)
                });
                console.log(response);

                if (response.ok) {
                    const result = await response.json();
                    // APICUADAICHENVAODAYNHOXOACOMMENTSAUKHITHEM
                    const fullAppointmentPayload = {
                        appointmentId: result.appointmentId, // Assuming the API returns the new appointmentId
                        appointmentDate: appointmentDate,
                        createdAt: new Date().toISOString(), // Use current time
                        updatedAt: new Date().toISOString(), // Use current time
                        doctor: requestData.doctorId,
                        notes: notes,
                        patient: patientId,
                        status: "pending", // Assuming initial status is pending
                        timeSlot: selectedTimeSlot
                    };

                    // Call the notification API
                    try {
                        const notificationResponse = await fetch(`<?php echo getenv('API_AJAX_URL'); ?>/api/notification/BookAppointment`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer <?php echo $_SESSION['user_session']['token']; ?>'
                            },
                            body: JSON.stringify(fullAppointmentPayload)
                        });
                        const notificationResult = await notificationResponse.json();
                        console.log('Notification API response for BookAppointment:', notificationResult);
                    } catch (notificationError) {
                        console.error('Error calling Notification API for BookAppointment:', notificationError);
                    }

                    // Call the analysis API
                    try {
                        const analysisResponse = await fetch(`<?php echo getenv('API_AJAX_URL'); ?>/api/analysis/BookAppointment`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer <?php echo $_SESSION['user_session']['token']; ?>'
                            },
                            body: JSON.stringify(fullAppointmentPayload)
                        });
                        const analysisResult = await analysisResponse.json();
                        console.log('Analysis API response for BookAppointment:', analysisResult);
                    } catch (analysisError) {
                        console.error('Error calling Analysis API for BookAppointment:', analysisError);
                    }
                    // End of new API calls
                    // Gọi API của Đại
                    // .... TO BE ADDED.

                    alert('Đặt lịch hẹn thành công!');
                    closeBookingForm();

                    window.location.href = '/doctors';
                } else {
                    const errorData = await response.json();

                    // Xử lý lỗi GRPC cụ thể
                    if (errorData.code === 'GRPC_CALL_FAILED' && errorData.message.includes('Patient has an appointment')) {
                        alert('Bệnh nhân đã có lịch hẹn vào khung giờ này. Vui lòng chọn khung giờ khác.');
                    } else if (errorData.message) {
                        alert(`Lỗi khi đặt lịch: ${errorData.message}`);
                    } else {
                        alert('Đã xảy ra lỗi không xác định khi đặt lịch.');
                    }
                }

            } catch (error) {
                console.error('Error booking appointment:', error);
                alert('Có lỗi xảy ra khi đặt lịch hẹn.');
            } finally {
                // Hide loading
                document.getElementById('loadingOverlay').style.display = 'none';
            }
        });

        <?php if (isset($_SESSION['user_session']) && $_SESSION['user_session']['role'] === 'admin'): ?>
            // Add delete function
            async function deleteDoctor(doctorId, doctorName) {
                // Show confirmation dialog
                if (!confirm(`Bạn có chắc chắn muốn xóa bác sĩ ${doctorName}?`)) {
                    return;
                }

                try {
                    const response = await fetch("<?php echo getenv('API_AJAX_URL'); ?>/api/doctor/deleteDoctors", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer <?php echo $_SESSION['user_session']['token']; ?>'
                        },
                        body: JSON.stringify({
                            doctorIds: [doctorId]
                        })
                    });

                    if (response.ok) {
                        // Show success message
                        alert('Xóa bác sĩ thành công!');
                        // Reload the page or refresh the doctor list
                        window.location.href = "/doctors";
                    } else {
                        const errorData = await response.json();
                        alert(`Lỗi khi xóa bác sĩ: ${errorData.message || 'Có lỗi xảy ra'}`);
                    }
                } catch (error) {
                    console.error('Error deleting doctor:', error);
                    alert('Có lỗi xảy ra khi xóa bác sĩ');
                }
            }
        <?php endif ?>

        // Close modal when clicking outside
        window.onclick = function(event) {
            const modal = document.getElementById('bookingModal');
            if (event.target === modal) {
                closeBookingForm();
            }
        }
    </script>
</body>

</html>

<?php
// Supporting functions for the view
function getDoctorName($doctor)
{
    // Check if fullName is available
    if (isset($doctor['fullName']) && !empty($doctor['fullName'])) {
        return $doctor['fullName'];
    }

    // Fetch user service to get first name and last name if fullName is not available
    if (isset($doctor['userId']) && !empty($doctor['userId'])) {
        try {
            $apiUrl = getenv('API_API_URL') ?: 'http://gateway:3000'; // fallback URL
            $userEndpoint = $apiUrl . '/api/user/getUserInternal/' . $doctor['userId'];

            // Initialize cURL
            $curl = curl_init();
            curl_setopt_array($curl, [
                CURLOPT_URL => $userEndpoint,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT => 5,
                CURLOPT_HTTPHEADER => [
                    'x-service-token: service-secret-token-123',
                    'Content-Type: application/json'
                ]
            ]);

            $response = curl_exec($curl);
            $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
            curl_close($curl);

            if ($httpCode === 200 && $response) {
                $userData = json_decode($response, true);

                if (isset($userData['user'])) {
                    $firstName = $userData['user']['firstName'] ?? '';
                    $lastName = $userData['user']['lastName'] ?? '';
                    $fullName = trim($firstName . ' ' . $lastName);

                    if (!empty($fullName)) {
                        return $fullName;
                    }
                }
            }
        } catch (Exception $e) {
            // Log error if needed
            error_log('Error fetching user data: ' . $e->getMessage());
        }
    }

    // Fallback if still no name
    if (isset($doctor['userId']) && !empty($doctor['userId'])) {
        return '#' . substr($doctor['userId'], 0, 8);
    }

    return 'Bác sĩ không xác định';
}

function formatTimestamp($timestamp)
{
    if (isset($timestamp['seconds'])) {
        $seconds = $timestamp['seconds'];

        // Cộng thêm 7 giờ (7 * 3600 = 25200 giây)
        $adjustedTime = $seconds + (7 * 3600);

        return date('d/m/Y H:i:s', $adjustedTime);
    }

    return 'N/A';
}

function translateDay($day)
{
    $translations = [
        'MONDAY' => 'Thứ Hai',
        'TUESDAY' => 'Thứ Ba',
        'WEDNESDAY' => 'Thứ Tư',
        'THURSDAY' => 'Thứ Năm',
        'FRIDAY' => 'Thứ Sáu',
        'SATURDAY' => 'Thứ Bảy',
        'SUNDAY' => 'Chủ Nhật'
    ];

    return $translations[strtoupper($day)] ?? $day;
}
?>