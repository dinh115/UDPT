<?php

require_once(__DIR__ . '/../models/Statistics.php');

class StatisticsController {
    private $statisticsModel;
    
    public function __construct() {
        $this->statisticsModel = new Statistics();
    }
    
    /**
     * Handle AJAX request for statistics data
     */
    public function getStatistics($startDate, $endDate, $groupType) { // Modified to accept parameters
        try {
            // Set content type to JSON
            header('Content-Type: application/json');
            
            // Parameters are now passed in, no need to get from $_GET or $_POST here
            // Get parameters from request (This part is removed as parameters are now passed in)
            // $startDate = $_GET['startDate'] ?? '2025-06-01';
            // $endDate = $_GET['endDate'] ?? '2025-07-31';
            // $groupType = $_GET['groupType'] ?? 'BY_MONTH';
            
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
            
            // Return JSON response
            echo json_encode([
                'success' => true,
                'data' => [
                    'patientStats' => $patientStats,
                    'prescriptionStats' => $prescriptionStats
                ]
            ]);
            
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }
    
    /**
     * Validate date format (YYYY-MM-DD)
     */
    private function validateDateFormat($date) {
        $d = DateTime::createFromFormat('Y-m-d', $date);
        return $d && $d->format('Y-m-d') === $date;
    }
}

// Handle AJAX requests
// if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'getStatistics') {
//     $controller = new StatisticsController();
//     $controller->getStatistics();
//     exit;
// }
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'getStatistics') {
    $controller = new StatisticsController();
    // Get parameters from request body (for POST, use $_POST)
    $startDate = $_POST['startDate'] ?? '2025-06-01';
    $endDate = $_POST['endDate'] ?? '2025-07-31';
    $groupType = $_POST['groupType'] ?? 'BY_MONTH';
    $controller->getStatistics($startDate, $endDate, $groupType); // Pass the parameters
    exit;
}