<?php

require_once(__DIR__ . '/../models/Statistics.php');

class Reports extends Controller {
    private $statisticsModel;

    public function __construct() {
        // Check if parent constructor exists before calling it
        if (method_exists('Controller', '__construct')) {
            parent::__construct();
        }
        $this->statisticsModel = new Statistics();
    }

    public function index() {
        $this->view("statistics/index");
    }

    /**
     * Handle AJAX request for statistics data
     */
    public function getStatistics() {
        try {
            // Set content type to JSON
            header('Content-Type: application/json');
            header('Access-Control-Allow-Origin: *');
            header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
            header('Access-Control-Allow-Headers: Content-Type');

            // Debug: Log that the method was called
            error_log("getStatistics method called");
            error_log("POST data: " . json_encode($_POST));

            // Get parameters from request
            $startDate = $_POST['startDate'] ?? '2025-06-01';
            $endDate = $_POST['endDate'] ?? '2025-07-31';
            $groupType = $_POST['groupType'] ?? 'BY_MONTH';

            // Debug: Log the parameters
            error_log("Parameters - Start: $startDate, End: $endDate, Group: $groupType");

            // Validate parameters
            if (!$this->validateDateFormat($startDate) || !$this->validateDateFormat($endDate)) {
                throw new Exception('Invalid date format');
            }

            if (!in_array($groupType, ['BY_DAY', 'BY_MONTH', 'BY_YEAR'])) {
                throw new Exception('Invalid group type');
            }

            // Get statistics data
            $patientStats = $this->statisticsModel->getPatientStats($startDate, $endDate, $groupType);
            $prescriptionStats = $this->statisticsModel->getPrescriptionStats($startDate, $endDate, $groupType);

            // Debug: Log the results
            error_log("Patient stats: " . json_encode($patientStats));
            error_log("Prescription stats: " . json_encode($prescriptionStats));

            // Return JSON response
            $response = [
                'success' => true,
                'data' => [
                    'patientStats' => $patientStats,
                    'prescriptionStats' => $prescriptionStats
                ]
            ];

            echo json_encode($response);
            exit; // Make sure to exit after sending response

        } catch (Exception $e) {
            error_log("Exception in getStatistics: " . $e->getMessage());
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
            exit;
        }
    }

    /**
     * Test API connectivity
     */
    public function testApi() {
        header('Content-Type: application/json');
        
        try {
            $result = $this->statisticsModel->testApiConnection();
            echo json_encode([
                'success' => true,
                'data' => $result
            ]);
        } catch (Exception $e) {
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
        exit;
    }

    /**
     * Validate date format (YYYY-MM-DD)
     */
    private function validateDateFormat($date) {
        $d = DateTime::createFromFormat('Y-m-d', $date);
        return $d && $d->format('Y-m-d') === $date;
    }
}