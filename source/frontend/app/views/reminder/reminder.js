$(document).ready(function() {
    // The AJAX URL has been updated to explicitly include 'index.php?url='
    // and uses the phpBaseUrl defined in the PHP view.
    // This ensures the URL format is compatible with App.php's parsing logic
    // without requiring web server URL rewriting.
    const ajaxUrl = `${phpBaseUrl}/index.php?url=reminder/api`;

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
                if (response.success && response.data && response.data.length > 0) {
                    populateAppointmentsTable(response.data);
                } else {
                    $('#noAppointments').show();
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', status, error);
                console.error('Response Text:', xhr.responseText);
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
            success: function(response) {
                if (response.success) {
                    toastr.success(response.message || 'Email nhắc nhở đã được gửi.');
                } else {
                    toastr.error(response.error || 'Có lỗi xảy ra khi gửi email nhắc nhở.');
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', status, error);
                console.error('Response Text:', xhr.responseText);
                toastr.error('Không thể gửi email nhắc nhở. Vui lòng kiểm tra console.');
            },
            complete: function() {
                button.prop('disabled', false).html('<i class="fas fa-envelope"></i> Email');
            }
        });
    });
});
