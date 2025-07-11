<?php require_once(__DIR__ . '/../template/header.php'); ?>

<body>
    <?php require_once(__DIR__ . '/../template/navbar.php'); ?>

    <div class="container mt-4">
        <h1 class="mb-4">Nhắc nhở lịch khám</h1>

        <div id="loading" class="text-center mt-4" style="display: none;">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Đang tải...</span>
            </div>
            <p class="mt-2">Đang tải dữ liệu lịch hẹn...</p>
        </div>

        <div class="card mb-4">
            <div class="card-header">
                <h5 class="mb-0">Các lịch hẹn sắp tới</h5>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Tên bệnh nhân</th>
                                <th>Email bệnh nhân</th>
                                <th>Ngày</th>
                                <th>Thời gian bắt đầu</th>
                                <th>Thời gian kết thúc</th>
                                <th>Tên bác sĩ</th>
                                <th>Phí tư vấn</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody id="appointmentsTableBody">
                            <!-- Data will be loaded here by JavaScript -->
                        </tbody>
                    </table>
                </div>
                <div id="noAppointments" class="text-center mt-3" style="display: none;">
                    Không có lịch hẹn nào sắp tới.
                </div>
            </div>
        </div>
    </div>

    <?php require_once(__DIR__ . '/../template/footer.php'); ?>
    <?php require_once(__DIR__ . '/../template/scripts.php'); ?>

    <!--
        The reminder.js content is now embedded directly here to bypass
        issues with the server incorrectly serving the external JS file.
        The phpBaseUrl is assumed to be defined in header.php.
    -->
    <script>
        $(document).ready(function() {
            // The AJAX URL explicitly includes 'index.php?url='
            // and uses the phpBaseUrl defined in the header.
            // This ensures the URL format is compatible with App.php's parsing logic.
            const ajaxUrl = `${phpBaseUrl}/index.php?url=reminder/api`;
            console.log('Frontend: AJAX URL set to:', ajaxUrl);

            // Load appointments on page load
            loadAppointments();

            /**
             * Loads upcoming confirmed appointments and populates the table.
             */
            function loadAppointments() {
                $('#loading').show();
                $('#appointmentsTableBody').empty();
                $('#noAppointments').hide();

                $.ajax({
                    url: ajaxUrl,
                    method: 'GET',
                    data: {
                        action: 'getUpcomingAppointments'
                    },
                    dataType: 'json',
                    success: function(response) {
                        console.log('Frontend: AJAX Success Response:', response);
                        if (response.success && response.data && response.data.length > 0) {
                            populateAppointmentsTable(response.data);
                        } else {
                            console.log('Frontend: No appointments or success is false. Showing "no appointments" message.');
                            $('#noAppointments').show();
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error('Frontend: AJAX Error:', status, error);
                        console.error('Frontend: Response Text:', xhr.responseText); // Log raw response text
                        toastr.error('Không thể tải dữ liệu lịch hẹn. Vui lòng kiểm tra console.');
                        $('#noAppointments').show();
                    },
                    complete: function() {
                        $('#loading').hide();
                    }
                });
            }

            /**
             * Populates the appointments table with data.
             * @param {Array} appointments - An array of appointment objects.
             */
            function populateAppointmentsTable(appointments) {
                const tableBody = $('#appointmentsTableBody');
                tableBody.empty(); // Clear existing rows before populating
                appointments.forEach(function(appointment) {
                    const row = `
                        <tr>
                            <td>${appointment.patientName}</td>
                            <td>${appointment.patientEmail}</td>
                            <td>${appointment.date}</td>
                            <td>${appointment.startTime}</td>
                            <td>${appointment.endTime}</td>
                            <td>${appointment.doctorName}</td>
                            <td>${appointment.consultationFee.toLocaleString('vi-VN')} VND</td>
                            <td>
                                <button class="btn btn-sm btn-info send-email-btn"
                                        data-patient-name="${appointment.patientName}"
                                        data-patient-email="${appointment.patientEmail}"
                                        data-date="${appointment.date}"
                                        data-start-time="${appointment.startTime}"
                                        data-end-time="${appointment.endTime}"
                                        data-doctor-name="${appointment.doctorName}"
                                        data-consultation-fee="${appointment.consultationFee}">
                                    <i class="fas fa-envelope"></i> Email
                                </button>
                            </td>
                        </tr>
                    `;
                    tableBody.append(row);
                });
                console.log('Frontend: Appointments table populated with', appointments.length, 'records.');
            }

            /**
             * Handles click event for "Email" button to send reminders.
             */
            $(document).on('click', '.send-email-btn', function() {
                const button = $(this);
                button.prop('disabled', true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Đang gửi...');

                const appointmentData = {
                    patientName: button.data('patient-name'),
                    patientEmail: button.data('patient-email'),
                    date: button.data('date'),
                    startTime: button.data('start-time'),
                    endTime: button.data('end-time'),
                    doctorName: button.data('doctor-name'),
                    consultationFee: button.data('consultation-fee')
                };
                console.log('Frontend: Sending reminder for:', appointmentData);

                $.ajax({
                    url: ajaxUrl,
                    method: 'POST',
                    data: {
                        action: 'sendReminder',
                        ...appointmentData
                    },
                    dataType: 'json',
                    success: function(response) {
                        console.log('Frontend: Send Reminder Success Response:', response);
                        if (response.success) {
                            toastr.success(response.message || 'Email nhắc nhở đã được gửi.');
                        } else {
                            toastr.error(response.error || 'Có lỗi xảy ra khi gửi email nhắc nhở.');
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error('Frontend: Send Reminder AJAX Error:', status, error);
                        console.error('Frontend: Send Reminder Response Text:', xhr.responseText);
                        toastr.error('Không thể gửi email nhắc nhở. Vui lòng kiểm tra console.');
                    },
                    complete: function() {
                        button.prop('disabled', false).html('<i class="fas fa-envelope"></i> Email');
                    }
                });
            });
        });
    </script>
</body>
