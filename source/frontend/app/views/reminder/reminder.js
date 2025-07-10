$(document).ready(function() {
    // Load appointments on page load
    loadAppointments();

    /**
     * Loads upcoming confirmed appointments and populates the table.
     */
    function loadAppointments() {
        $('#loading').show();
        $('#appointmentsTableBody').empty(); // Clear existing table data
        $('#noAppointments').hide(); // Hide no appointments message initially

        $.ajax({
            url: '../../controllers/NotificationController.php',
            method: 'GET',
            data: {
                action: 'getUpcomingAppointments'
            },
            dataType: 'json',
            success: function(response) {
                if (response.success && response.data.length > 0) {
                    populateAppointmentsTable(response.data);
                } else {
                    $('#noAppointments').show();
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', error);
                toastr.error('Không thể tải dữ liệu lịch hẹn.');
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
            url: '../../controllers/NotificationController.php',
            method: 'POST',
            data: {
                action: 'sendReminder',
                ...appointmentData // Spread operator to include all data
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
                console.error('AJAX Error:', error);
                toastr.error('Không thể gửi email nhắc nhở.');
            },
            complete: function() {
                button.prop('disabled', false).html('<i class="fas fa-envelope"></i> Email');
            }
        });
    });
});