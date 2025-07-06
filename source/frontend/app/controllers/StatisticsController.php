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
    public function getStatistics() {
        try {
            // Set content type to JSON
            header('Content-Type: application/json');
            
            // Get parameters from request
            $startDate = $_GET['startDate'] ?? '2025-06-01';
            $endDate = $_GET['endDate'] ?? '2025-07-31';
            $groupType = $_GET['groupType'] ?? 'BY_MONTH';
            
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
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'getStatistics') {
    $controller = new StatisticsController();
    $controller->getStatistics();
    exit;
}