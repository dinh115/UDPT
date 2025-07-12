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
        // Enable error reporting for debugging
        ini_set('display_errors', 1);
        error_reporting(E_ALL);

        // Set content type to JSON
        header('Content-Type: application/json');
        
        // Add CORS headers if needed
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');

        // Handle preflight requests
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit;
        }

        try {
            $action = $_REQUEST['action'] ?? ''; // Get action from GET or POST request

            error_log("Reminder Controller: API request received with action: " . $action);
            error_log("Reminder Controller: Request method: " . $_SERVER['REQUEST_METHOD']);
            error_log("Reminder Controller: GET data: " . json_encode($_GET));
            error_log("Reminder Controller: POST data: " . json_encode($_POST));

            switch ($action) {
                case 'getUpcomingAppointments':
                    $this->getUpcomingAppointments();
                    break;
                case 'sendReminder':
                    $this->sendReminder();
                    break;
                default:
                    error_log("Reminder Controller: Invalid API action: " . $action);
                    http_response_code(400);
                    echo json_encode([
                        'success' => false, 
                        'error' => 'Invalid API action: ' . $action,
                        'available_actions' => ['getUpcomingAppointments', 'sendReminder']
                    ]);
                    break;
            }
        } catch (Exception $e) {
            error_log("Reminder Controller: Exception in API: " . $e->getMessage());
            error_log("Reminder Controller: Exception trace: " . $e->getTraceAsString());
            http_response_code(500);
            echo json_encode([
                'success' => false, 
                'error' => 'Internal server error: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Fetches upcoming confirmed appointments and returns them as JSON.
     */
    private function getUpcomingAppointments() {
        try {
            error_log("Reminder Controller: Starting getUpcomingAppointments");
            
            $response = $this->notificationModel->getUpcomingConfirmedAppointments();
            error_log("Reminder Controller: Response from Notification Model (getUpcomingAppointments): " . json_encode($response));

            // Validate response structure
            if (!is_array($response)) {
                error_log("Reminder Controller: Invalid response format from model - not an array");
                echo json_encode([
                    'success' => false, 
                    'error' => 'Invalid response format from model',
                    'data' => []
                ]);
                return;
            }

            // Ensure the response always has 'success' and 'data' keys for consistency with frontend
            if (!isset($response['success'])) {
                error_log("Reminder Controller: Response missing 'success' key, defaulting to false");
                $response['success'] = false;
            }
            
            if (!isset($response['data'])) {
                error_log("Reminder Controller: Response missing 'data' key, defaulting to empty array");
                $response['data'] = [];
            }

            // Additional validation for data structure
            if (!is_array($response['data'])) {
                error_log("Reminder Controller: Response data is not an array");
                $response['data'] = [];
                $response['success'] = false;
                $response['error'] = 'Invalid data format';
            }

            error_log("Reminder Controller: Final response: " . json_encode($response));
            echo json_encode($response);
            
        } catch (Exception $e) {
            error_log("Reminder Controller: Exception in getUpcomingAppointments: " . $e->getMessage());
            echo json_encode([
                'success' => false, 
                'error' => 'Failed to fetch appointments: ' . $e->getMessage(),
                'data' => []
            ]);
        }
    }

    /**
     * Sends a reminder email for a specific appointment and returns the status as JSON.
     */
    private function sendReminder() {
        try {
            error_log("Reminder Controller: Starting sendReminder");
            
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

            // Enhanced validation
            $requiredFields = ['patientEmail', 'date', 'patientName'];
            $missingFields = [];
            
            foreach ($requiredFields as $field) {
                if (empty($appointmentData[$field])) {
                    $missingFields[] = $field;
                }
            }

            if (!empty($missingFields)) {
                error_log("Reminder Controller: Missing required fields: " . implode(', ', $missingFields));
                echo json_encode([
                    'success' => false, 
                    'error' => 'Missing required fields: ' . implode(', ', $missingFields),
                    'required_fields' => $requiredFields,
                    'received_data' => $appointmentData
                ]);
                return;
            }

            // Validate email format
            if (!filter_var($appointmentData['patientEmail'], FILTER_VALIDATE_EMAIL)) {
                error_log("Reminder Controller: Invalid email format: " . $appointmentData['patientEmail']);
                echo json_encode([
                    'success' => false, 
                    'error' => 'Invalid email format: ' . $appointmentData['patientEmail']
                ]);
                return;
            }

            $response = $this->notificationModel->sendReminder($appointmentData);
            error_log("Reminder Controller: Response from Notification Model (sendReminder): " . json_encode($response));

            // Validate response structure
            if (!is_array($response)) {
                error_log("Reminder Controller: Invalid response format from model - not an array");
                echo json_encode([
                    'success' => false, 
                    'error' => 'Invalid response format from model'
                ]);
                return;
            }

            // Ensure the response always has 'success' and 'message' or 'error' keys
            if (!isset($response['success'])) {
                error_log("Reminder Controller: Response missing 'success' key, defaulting to false");
                $response['success'] = false;
            }

            if (!$response['success'] && !isset($response['error'])) {
                $response['error'] = 'Unknown error occurred while sending reminder';
            }

            if ($response['success'] && !isset($response['message'])) {
                $response['message'] = 'Reminder sent successfully';
            }

            error_log("Reminder Controller: Final sendReminder response: " . json_encode($response));
            echo json_encode($response);
            
        } catch (Exception $e) {
            error_log("Reminder Controller: Exception in sendReminder: " . $e->getMessage());
            echo json_encode([
                'success' => false, 
                'error' => 'Failed to send reminder: ' . $e->getMessage()
            ]);
        }
    }
}