<?php

require_once(__DIR__ . '/../models/Notification.php');

class NotificationController {
    private $notificationModel;
    
    public function __construct() {
        $this->notificationModel = new Notification();
    }
    
    /**
     * Handle AJAX request for upcoming confirmed appointments data.
     */
    public function getUpcomingConfirmedAppointments() {
        try {
            header('Content-Type: application/json');
            
            $appointments = $this->notificationModel->getUpcomingConfirmedAppointments();
            
            if (isset($appointments['appointments'])) { // Check if the 'appointments' key exists
                echo json_encode([
                    'success' => true,
                    'data' => $appointments['appointments']
                ]);
            } else {
                // If 'appointments' key is missing or API returned an error structure
                throw new Exception('Invalid API response structure for appointments.');
            }
            
        } catch (Exception $e) {
            http_response_code(500); // Internal Server Error
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Handle AJAX request to send an email reminder.
     */
    public function sendReminder() {
        try {
            header('Content-Type: application/json');

            // Get appointment data from request body
            $patientName = $_POST['patientName'] ?? null;
            $patientEmail = $_POST['patientEmail'] ?? null;
            $date = $_POST['date'] ?? null;
            $startTime = $_POST['startTime'] ?? null;
            $endTime = $_POST['endTime'] ?? null;
            $doctorName = $_POST['doctorName'] ?? null;
            $consultationFee = $_POST['consultationFee'] ?? null;

            // Basic validation
            if (!$patientName || !$patientEmail || !$date || !$startTime || !$endTime || !$doctorName || $consultationFee === null) {
                throw new Exception('Missing required appointment data for sending reminder.');
            }

            $appointmentData = [
                'patientName' => $patientName,
                'patientEmail' => $patientEmail,
                'date' => $date,
                'startTime' => $startTime,
                'endTime' => $endTime,
                'doctorName' => $doctorName,
                'consultationFee' => (int)$consultationFee // Ensure integer type if needed by API
            ];

            $response = $this->notificationModel->sendReminder($appointmentData);

            if (isset($response['success']) && $response['success'] === true) {
                echo json_encode([
                    'success' => true,
                    'message' => $response['message'] ?? 'Email request queued successfully.'
                ]);
            } else {
                throw new Exception($response['message'] ?? 'Failed to queue email request.');
            }

        } catch (Exception $e) {
            http_response_code(400); // Bad Request
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }
}

// Handle AJAX requests
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'getUpcomingAppointments') {
    $controller = new NotificationController();
    $controller->getUpcomingConfirmedAppointments();
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'sendReminder') {
    $controller = new NotificationController();
    $controller->sendReminder();
    exit;
}