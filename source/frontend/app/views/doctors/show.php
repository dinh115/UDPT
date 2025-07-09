<?php
// This should be saved as ../app/views/doctors/show.php
require_once(__DIR__ . '/../template/header.php');
?>

<body>
    <?php require_once(__DIR__ . '/../template/navbar.php'); ?>
    <link rel="stylesheet" href="<?= $baseUrl ?>/css/showDoctor.css">
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
                            <?php if (isset($_SESSION['user_session']) && $_SESSION['user_session']['role'] === 'admin'): ?>

                                <div class="info-item">
                                    <span class="info-label">User ID:</span>
                                    <span class="info-value"><?php echo htmlspecialchars($doctor['userId']); ?></span>
                                </div>
                            <?php endif ?>

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
                        <?php if (isset($_SESSION['user_session']) && $_SESSION['user_session']['role'] === 'admin'): ?>

                            <a href="/doctors/update/<?php echo $doctor['id']; ?>" class="btn-custom btn-update">
                                <i class="fas fa-edit"></i>
                                Cập nhật
                            </a>
                            <a class="btn-custom btn-delete" onclick="deleteDoctor('<?php echo $doctor['id']; ?>', '<?php echo $doctorName ?>')">
                                <i class="fas fa-trash"></i>
                                Xóa hồ sơ
                            </a>
                        <?php endif ?>

                        <a href="/appointments/create/<?php echo $doctor['id']; ?>" class="btn-custom btn-appointment">
                            <i class="fas fa-calendar-plus"></i>
                            Đặt lịch hẹn
                        </a>
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

    <?php require_once(__DIR__ . '/../template/footer.php'); ?>
    <?php require_once(__DIR__ . '/../template/scripts.php'); ?>
    <script>
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
                        //
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