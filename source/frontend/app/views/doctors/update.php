<?php
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
                            <h3 class="card-title">Cập nhật Hồ Sơ Bác Sĩ</h3>
                            <p class="card-subtitle">Chỉnh sửa thông tin bác sĩ và lịch khám</p>
                        </div>
                    </div>

                    <?php if (isset($doctor) && $doctor): ?>
                        <form id="updateDoctorForm">
                            <!-- Hidden Doctor ID -->
                            <input type="hidden" id="doctorId" value="<?php echo htmlspecialchars($doctor['id']); ?>">

                            <!-- Doctor Name Header -->
                            <div class="info-section">
                                <div class="doctor-name-header">
                                    <h2 class="doctor-name">
                                        <i class="fas fa-user-md"></i>
                                        Bác sĩ: <?php echo htmlspecialchars(getDoctorName($doctor)); ?>
                                    </h2>
                                </div>
                            </div>

                            <!-- Basic Information (Admin Only) -->
                            <?php if (isset($_SESSION['user_session']) && $_SESSION['user_session']['role'] === 'admin'): ?>
                                <div class="info-section">
                                    <h4 class="section-title">
                                        <i class="fas fa-info-circle"></i>
                                        Thông tin cơ bản
                                    </h4>

                                    <div class="form-group mb-3">
                                        <label for="specialization" class="form-label">Chuyên khoa</label>
                                        <input type="text"
                                            class="form-control"
                                            id="specialization"
                                            value="<?php echo htmlspecialchars($doctor['specialization'] ?? ''); ?>"
                                            placeholder="Nhập chuyên khoa">
                                    </div>

                                    <div class="form-group mb-3">
                                        <label for="experience" class="form-label">Kinh nghiệm (năm)</label>
                                        <input type="number"
                                            class="form-control"
                                            id="experience"
                                            value="<?php echo htmlspecialchars($doctor['experience'] ?? ''); ?>"
                                            placeholder="Nhập số năm kinh nghiệm"
                                            min="0">
                                    </div>

                                    <div class="form-group mb-3">
                                        <label for="qualifications" class="form-label">Bằng cấp & Chứng chỉ</label>
                                        <textarea class="form-control"
                                            id="qualifications"
                                            rows="3"
                                            placeholder="Nhập bằng cấp, mỗi bằng cấp trên một dòng"><?php
                                                                                                    if (isset($doctor['qualifications']) && is_array($doctor['qualifications'])) {
                                                                                                        echo htmlspecialchars(implode("\n", $doctor['qualifications']));
                                                                                                    }
                                                                                                    ?></textarea>
                                        <small class="form-text text-muted">Mỗi bằng cấp/chứng chỉ trên một dòng</small>
                                    </div>
                                </div>
                            <?php endif; ?>

                            <!-- Availability Section -->
                            <div class="info-section">
                                <h4 class="section-title">
                                    <i class="fas fa-calendar-alt"></i>
                                    Lịch khám
                                </h4>

                                <div id="availability-container">
                                    <?php
                                    $daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
                                    $existingAvailability = isset($doctor['availability']) ? $doctor['availability'] : [];

                                    // Create a lookup array for existing availability
                                    $availabilityLookup = [];
                                    foreach ($existingAvailability as $avail) {
                                        $availabilityLookup[$avail['day']] = $avail['slots'] ?? [];
                                    }
                                    ?>

                                    <?php foreach ($daysOfWeek as $day): ?>
                                        <div class="day-availability mb-4">
                                            <div class="day-header">
                                                <h5>
                                                    <i class="fas fa-calendar-day"></i>
                                                    <?php echo translateDay($day); ?>
                                                </h5>
                                                <button type="button"
                                                    class="btn btn-sm btn-primary"
                                                    onclick="addTimeSlot('<?php echo $day; ?>')">
                                                    <i class="fas fa-plus"></i> Thêm khung giờ
                                                </button>
                                            </div>

                                            <div class="time-slots-container" id="slots-<?php echo $day; ?>">
                                                <?php if (isset($availabilityLookup[$day])): ?>
                                                    <?php foreach ($availabilityLookup[$day] as $index => $slot): ?>
                                                        <div class="time-slot-input mb-2">
                                                            <div class="row">
                                                                <div class="col-md-4">
                                                                    <input type="time"
                                                                        class="form-control"
                                                                        name="availability[<?php echo $day; ?>][<?php echo $index; ?>][startTime]"
                                                                        value="<?php echo htmlspecialchars($slot['startTime']); ?>"
                                                                        required>
                                                                </div>
                                                                <div class="col-md-4">
                                                                    <input type="time"
                                                                        class="form-control"
                                                                        name="availability[<?php echo $day; ?>][<?php echo $index; ?>][endTime]"
                                                                        value="<?php echo htmlspecialchars($slot['endTime']); ?>"
                                                                        required>
                                                                </div>
                                                                <div class="col-md-4">
                                                                    <button type="button"
                                                                        class="btn btn-sm btn-danger"
                                                                        onclick="removeTimeSlot(this)">
                                                                        <i class="fas fa-trash"></i>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    <?php endforeach; ?>
                                                <?php endif; ?>
                                            </div>
                                        </div>
                                    <?php endforeach; ?>
                                </div>
                            </div>

                            <!-- Action Buttons -->
                            <div class="action-buttons">
                                <button type="submit" class="btn-custom btn-update">
                                    <i class="fas fa-save"></i>
                                    Cập nhật
                                </button>
                                <a href="/doctors/show/<?php echo $doctor['id']; ?>" class="btn-custom btn-secondary">
                                    <i class="fas fa-arrow-left"></i>
                                    Quay lại
                                </a>
                            </div>
                        </form>

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
        // Global counter for unique slot IDs
        let slotCounters = {
            'MONDAY': <?php echo isset($availabilityLookup['MONDAY']) ? count($availabilityLookup['MONDAY']) : 0; ?>,
            'TUESDAY': <?php echo isset($availabilityLookup['TUESDAY']) ? count($availabilityLookup['TUESDAY']) : 0; ?>,
            'WEDNESDAY': <?php echo isset($availabilityLookup['WEDNESDAY']) ? count($availabilityLookup['WEDNESDAY']) : 0; ?>,
            'THURSDAY': <?php echo isset($availabilityLookup['THURSDAY']) ? count($availabilityLookup['THURSDAY']) : 0; ?>,
            'FRIDAY': <?php echo isset($availabilityLookup['FRIDAY']) ? count($availabilityLookup['FRIDAY']) : 0; ?>,
            'SATURDAY': <?php echo isset($availabilityLookup['SATURDAY']) ? count($availabilityLookup['SATURDAY']) : 0; ?>,
            'SUNDAY': <?php echo isset($availabilityLookup['SUNDAY']) ? count($availabilityLookup['SUNDAY']) : 0; ?>
        };

        function addTimeSlot(day) {
            const container = document.getElementById(`slots-${day}`);
            const index = slotCounters[day]++;

            const slotDiv = document.createElement('div');
            slotDiv.className = 'time-slot-input mb-2';
            slotDiv.innerHTML = `
                <div class="row">
                    <div class="col-md-4">
                        <input type="time" 
                               class="form-control" 
                               name="availability[${day}][${index}][startTime]"
                               required>
                    </div>
                    <div class="col-md-4">
                        <input type="time" 
                               class="form-control" 
                               name="availability[${day}][${index}][endTime]"
                               required>
                    </div>
                    <div class="col-md-4">
                        <button type="button" 
                                class="btn btn-sm btn-danger" 
                                onclick="removeTimeSlot(this)">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;

            container.appendChild(slotDiv);
        }

        function removeTimeSlot(button) {
            button.closest('.time-slot-input').remove();
        }

        // Form submission handler
        document.getElementById('updateDoctorForm').addEventListener('submit', async function(e) {
            e.preventDefault();

            const doctorId = document.getElementById('doctorId').value;
            const formData = new FormData(this);

            // Prepare the data object
            const updateData = {
                userId: "<?php echo (isset($doctor['userId']) && isset($doctor)) ? htmlspecialchars($doctor['userId']) : '' ?>"
            };

            <?php if (isset($_SESSION['user_session']) && $_SESSION['user_session']['role'] === 'admin'): ?>
                // Admin can update basic info
                const specialization = document.getElementById('specialization').value.trim();
                const experience = document.getElementById('experience').value;
                const qualifications = document.getElementById('qualifications').value.trim();

                if (specialization) updateData.specialization = specialization;
                if (experience) updateData.experience = parseInt(experience);
                if (qualifications) {
                    updateData.qualifications = qualifications.split('\n').filter(q => q.trim());
                }
            <?php endif; ?>

            // Process availability data
            const availability = [];
            const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

            days.forEach(day => {
                const slots = [];
                const container = document.getElementById(`slots-${day}`);
                const slotInputs = container.querySelectorAll('.time-slot-input');

                slotInputs.forEach(slotInput => {
                    const startTime = slotInput.querySelector('input[name*="[startTime]"]').value;
                    const endTime = slotInput.querySelector('input[name*="[endTime]"]').value;

                    if (startTime && endTime) {
                        slots.push({
                            startTime: startTime,
                            endTime: endTime
                        });
                    }
                });

                if (slots.length > 0) {
                    availability.push({
                        day: day,
                        slots: slots
                    });
                }
            });

            updateData.availability = availability;

            try {
                const response = await fetch('<?php echo getenv('API_AJAX_URL'); ?>/api/doctor/UpdateDoctorProfile', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer <?php echo $_SESSION['user_session']['token']; ?>'
                    },
                    body: JSON.stringify(updateData)
                });

                console.log(JSON.stringify(updateData));
                console.log(response)

                if (response.ok) {
                    alert('Cập nhật thông tin bác sĩ thành công!');
                    window.location.href = `/doctors/show/${doctorId}`;
                } else {
                    const errorData = await response.json();
                    alert(`Lỗi khi cập nhật: ${errorData.message || 'Có lỗi xảy ra'}`);
                }
            } catch (error) {
                console.error('Error updating doctor:', error);
                alert('Có lỗi xảy ra khi cập nhật thông tin bác sĩ');
            }
        });
    </script>

    <style>
        .day-availability {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            background-color: #f8f9fa;
        }

        .day-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }

        .day-header h5 {
            margin: 0;
            color: #495057;
        }

        .time-slot-input {
            background-color: white;
            padding: 10px;
            border-radius: 5px;
            border: 1px solid #dee2e6;
        }

        .form-group label {
            font-weight: 600;
        }

        .btn-secondary {
            background-color: #6c757d;
            border-color: #6c757d;
        }

        .btn-secondary:hover {
            background-color: #5a6268;
            border-color: #545b62;
        }
    </style>
</body>

</html>

<?php
// Include the same helper functions from show.php
function getDoctorName($doctor)
{
    if (isset($doctor['fullName']) && !empty($doctor['fullName'])) {
        return $doctor['fullName'];
    }

    if (isset($doctor['userId']) && !empty($doctor['userId'])) {
        try {
            $apiUrl = getenv('API_API_URL') ?: 'http://gateway:3000';
            $userEndpoint = $apiUrl . '/api/user/getUserInternal/' . $doctor['userId'];

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
            error_log('Error fetching user data: ' . $e->getMessage());
        }
    }

    if (isset($doctor['userId']) && !empty($doctor['userId'])) {
        return '#' . substr($doctor['userId'], 0, 8);
    }

    return 'Bác sĩ không xác định';
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