<?php

require_once __DIR__ . '/../models/Notification.php';

/**
 * This controller handles the display of the main reminder page
 * and processes API requests related to reminders (fetching appointments, sending emails).
 */
class Reminder {
    private $notificationModel;

    /**
     * Constructor to initialize the Notification model.
     */
    public function __construct() {
        $this->notificationModel = new Notification();
    }

    /**
     * Renders the main reminder page view.
     * The view itself contains JavaScript to fetch appointment data asynchronously.
     */
    public function index() {
        // This global variable is likely defined in a core/bootstrap file.
        // It's needed to correctly reference CSS and JS files from your public directory.
        global $baseUrl;

        // You can set page-specific variables for your templates here.
        $title = 'MedPortal - Nhắc nhở Lịch khám';
        $description = 'Xem và gửi nhắc nhở cho các lịch hẹn sắp tới.';

        // Load the view file for the reminder page.
        require_once __DIR__ . '/../views/reminder/index.php';
    }

    /**
     * Handles API requests for the Reminder functionality.
     * This method acts as an API endpoint for fetching appointments and sending reminders.
     */
    public function api() {
        // Set content type to JSON
        header('Content-Type: application/json');

        $action = $_REQUEST['action'] ?? ''; // Get action from GET or POST request

        error_log("Reminder Controller: API request received with action: " . $action);

        switch ($action) {
            case 'getUpcomingAppointments':
                $this->getUpcomingAppointments();
                break;
            case 'sendReminder':
                $this->sendReminder();
                break;
            default:
                error_log("Reminder Controller: Invalid API action: " . $action);
                echo json_encode(['success' => false, 'error' => 'Invalid API action.']);
                break;
        }
    }

    /**
     * Fetches upcoming confirmed appointments and returns them as JSON.
     */
    private function getUpcomingAppointments() {
        $response = $this->notificationModel->getUpcomingConfirmedAppointments();
        error_log("Reminder Controller: Response from Notification Model (getUpcomingAppointments): " . json_encode($response));

        // Ensure the response always has 'success' and 'data' keys for consistency with frontend
        if (!isset($response['success'])) {
            $response['success'] = false; // Default to false if not set by model
        }
        if (!isset($response['data'])) {
            $response['data'] = []; // Default to empty array if not set
        }

        echo json_encode($response);
    }

    /**
     * Sends a reminder email for a specific appointment and returns the status as JSON.
     */
    private function sendReminder() {
        // Collect appointment data from the POST request
        $appointmentData = [
            'patientName' => $_POST['patientName'] ?? null,
            'patientEmail' => $_POST['patientEmail'] ?? null,
            'date' => $_POST['date'] ?? null,
            'startTime' => $_POST['startTime'] ?? null,
            'endTime' => $_POST['endTime'] ?? null,
            'doctorName' => $_POST['doctorName'] ?? null,
            'consultationFee' => $_POST['consultationFee'] ?? null,
        ];

        error_log("Reminder Controller: Received appointment data for sendReminder: " . json_encode($appointmentData));

        // Basic validation (you might want more robust validation)
        if (empty($appointmentData['patientEmail']) || empty($appointmentData['date'])) {
            error_log("Reminder Controller: Missing required appointment data for sending reminder.");
            echo json_encode(['success' => false, 'error' => 'Missing required appointment data for sending reminder.']);
            return;
        }

        $response = $this->notificationModel->sendReminder($appointmentData);
        error_log("Reminder Controller: Response from Notification Model (sendReminder): " . json_encode($response));

        // Ensure the response always has 'success' and 'message' or 'error' keys
        if (!isset($response['success'])) {
            $response['success'] = false;
            if (!isset($response['error'])) {
                $response['error'] = 'Unknown error from API.';
            }
        }

        echo json_encode($response);
    }
}
