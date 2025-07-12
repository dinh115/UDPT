<?php require_once(__DIR__ . '/../template/header.php'); ?>

<body>
    <?php require_once(__DIR__ . '/../template/navbar.php'); ?>

    <div class="container mt-4">
        <h1 class="mb-4 text-dark">Nhắc nhở lịch khám</h1>

        <div id="loading" class="text-center mt-4" style="display: none;">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Đang tải...</span>
            </div>
            <p class="mt-2">Đang tải dữ liệu lịch hẹn...</p>
        </div>

        <div class="card mb-4">
            <div class="card-header">
                <h5 class="mb-0 text-dark">Các lịch hẹn sắp tới</h5>
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

    <script>
        $(document).ready(function() {
            // Helper function to add debug info (Removed - kept for reference if needed)
            // function addDebugInfo(message) {
            //     const timestamp = new Date().toLocaleTimeString();
            //     $('#debugInfo').append(`<div>[${timestamp}] ${message}</div>`);
            // }

            // Check if phpBaseUrl is defined
            if (typeof phpBaseUrl === 'undefined') {
                // Fallback - try to determine base URL from current location
                const currentUrl = window.location.href;
                const pathArray = currentUrl.split('/');
                const protocol = pathArray[0];
                const host = pathArray[2];
                phpBaseUrl = protocol + '//' + host;
            }

            // Construct AJAX URL more carefully
            let ajaxUrl;
            if (phpBaseUrl.endsWith('/')) {
                ajaxUrl = phpBaseUrl + 'index.php?url=reminder/api';
            } else {
                ajaxUrl = phpBaseUrl + '/index.php?url=reminder/api';
            }
            
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
                    timeout: 15000,
                    success: function(response) {
                        let appointmentsArray = null;
                        
                        // Check various possible data structures
                        if (response && response.success) {
                            // Structure 1: response.data.appointments (your current API structure)
                            if (response.data && response.data.appointments && Array.isArray(response.data.appointments)) {
                                appointmentsArray = response.data.appointments;
                            }
                            // Structure 2: response.data is direct array
                            else if (response.data && Array.isArray(response.data)) {
                                appointmentsArray = response.data;
                            }
                            // Structure 3: response is direct array
                            else if (Array.isArray(response)) {
                                appointmentsArray = response;
                            }
                        }
                        
                        // Check if we found valid appointments
                        if (appointmentsArray && appointmentsArray.length > 0) {
                            populateAppointmentsTable(appointmentsArray);
                        } else {
                            // Additional debugging for troubleshooting (Removed - kept for reference if needed)
                            // if (response && !response.success) {
                            //     // Error handling can go here, e.g., display a user-friendly message
                            // }
                            
                            $('#noAppointments').show();
                        }
                    },
                    error: function(xhr, status, error) {
                        let errorMessage = 'Không thể tải dữ liệu lịch hẹn.';
                        if (xhr.status === 0) {
                            errorMessage += ' Không thể kết nối đến server.';
                        } else if (xhr.status === 404) {
                            errorMessage += ' Không tìm thấy API endpoint.';
                        } else if (xhr.status === 500) {
                            errorMessage += ' Lỗi server nội bộ.';
                        } else {
                            errorMessage += ' Mã lỗi: ' + xhr.status;
                        }
                        
                        if (typeof toastr !== 'undefined') {
                            toastr.error(errorMessage);
                        } else {
                            alert(errorMessage);
                        }
                        $('#noAppointments').show();
                    },
                    complete: function() {
                        $('#loading').hide();
                    }
                });
            }

            /**
             * Populates the appointments table with data.
             */
            function populateAppointmentsTable(appointments) {
                const tableBody = $('#appointmentsTableBody');
                tableBody.empty();

                appointments.forEach(function(appointment) {
                    // Safe value extraction with fallbacks
                    const patientName = appointment.patientName || appointment.patient_name || 'N/A';
                    const patientEmail = appointment.patientEmail || appointment.patient_email || 'N/A';
                    const date = appointment.date || appointment.appointment_date || 'N/A';
                    const startTime = appointment.startTime || appointment.start_time || 'N/A';
                    const endTime = appointment.endTime || appointment.end_time || 'N/A';
                    const doctorName = appointment.doctorName || appointment.doctor_name || 'N/A';
                    const consultationFee = appointment.consultationFee || appointment.consultation_fee || 0;
                    
                    const row = `
                        <tr>
                            <td>${escapeHtml(patientName)}</td>
                            <td>${escapeHtml(patientEmail)}</td>
                            <td>${escapeHtml(date)}</td>
                            <td>${escapeHtml(startTime)}</td>
                            <td>${escapeHtml(endTime)}</td>
                            <td>${escapeHtml(doctorName)}</td>
                            <td>${Number(consultationFee).toLocaleString('vi-VN')} VND</td>
                            <td>
                                <button class="btn btn-sm btn-info send-email-btn"
                                        data-patient-name="${escapeHtml(patientName)}"
                                        data-patient-email="${escapeHtml(patientEmail)}"
                                        data-date="${escapeHtml(date)}"
                                        data-start-time="${escapeHtml(startTime)}"
                                        data-end-time="${escapeHtml(endTime)}"
                                        data-doctor-name="${escapeHtml(doctorName)}"
                                        data-consultation-fee="${consultationFee}">
                                    <i class="fas fa-envelope"></i> Email
                                </button>
                            </td>
                        </tr>
                    `;
                    tableBody.append(row);
                });
            }

            /**
             * Escape HTML to prevent XSS
             */
            function escapeHtml(text) {
                if (typeof text !== 'string') {
                    return text;
                }
                const div = document.createElement('div');
                div.textContent = text;
                return div.innerHTML;
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
                
                $.ajax({
                    url: ajaxUrl,
                    method: 'POST',
                    data: {
                        action: 'sendReminder',
                        ...appointmentData
                    },
                    dataType: 'json',
                    timeout: 30000,
                    success: function(response) {
                        if (response && response.success) {
                            const message = response.message || 'Email nhắc nhở đã được gửi thành công.';
                            if (typeof toastr !== 'undefined') {
                                toastr.success(message);
                            } else {
                                alert(message);
                            }
                        } else {
                            const errorMsg = (response && response.error) || 'Có lỗi xảy ra khi gửi email nhắc nhở.';
                            if (typeof toastr !== 'undefined') {
                                toastr.error(errorMsg);
                            } else {
                                alert(errorMsg);
                            }
                        }
                    },
                    error: function(xhr, status, error) {
                        const errorMsg = 'Không thể gửi email nhắc nhở. Vui lòng thử lại.';
                        if (typeof toastr !== 'undefined') {
                            toastr.error(errorMsg);
                        } else {
                            alert(errorMsg);
                        }
                    },
                    complete: function() {
                        button.prop('disabled', false).html('<i class="fas fa-envelope"></i> Email');
                    }
                });
            });
        });
    </script>
</body>