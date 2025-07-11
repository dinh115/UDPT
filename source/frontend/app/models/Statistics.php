<?php

class Statistics {
    private $apiBaseUrl = 'http://gateway:3000/api/analysis/';

    public function __construct() {
        // No database connection needed as data will be fetched from API
    }

    /**
     * Get patient statistics based on filters
     * @param string $startDate The start date for the statistics (e.g., 'YYYY-MM-DD')
     * @param string $endDate The end date for the statistics (e.g., 'YYYY-MM-DD')
     * @param string $groupType The type of grouping (e.g., 'BY_DAY', 'BY_MONTH', 'BY_YEAR')
     * @return array An associative array containing patient statistics
     */
    public function getPatientStats($startDate, $endDate, $groupType) {
        $endpoint = $this->apiBaseUrl . 'GetPatientStatistics';
        $postData = [
            'startDate' => $startDate,
            'endDate' => $endDate,
            'groupType' => $groupType
        ];

        error_log("=== PATIENT STATS DEBUG ===");
        error_log("Calling API for Patient Stats: " . $endpoint);
        error_log("POST data: " . json_encode($postData));
        
        $result = $this->callApi($endpoint, $postData);
        error_log("Patient Stats Result: " . json_encode($result));
        
        return $result;
    }

    /**
     * Get prescription statistics based on filters
     * @param string $startDate The start date for the statistics (e.g., 'YYYY-MM-DD')
     * @param string $endDate The end date for the statistics (e.g., 'YYYY-MM-DD')
     * @param string $groupType The type of grouping (e.g., 'BY_DAY', 'BY_MONTH', 'BY_YEAR')
     * @return array An associative array containing prescription statistics
     */
    public function getPrescriptionStats($startDate, $endDate, $groupType) {
        $endpoint = $this->apiBaseUrl . 'GetPrescriptionStatistics';
        $postData = [
            'startDate' => $startDate,
            'endDate' => $endDate,
            'groupType' => $groupType
        ];

        error_log("=== PRESCRIPTION STATS DEBUG ===");
        error_log("Calling API for Prescription Stats: " . $endpoint);
        error_log("POST data: " . json_encode($postData));
        
        $result = $this->callApi($endpoint, $postData);
        error_log("Prescription Stats Result: " . json_encode($result));
        
        return $result;
    }

    /**
     * Helper function to make API calls
     * @param string $url The API endpoint URL
     * @param array $postData The data to send in the POST request body
     * @return array The decoded JSON response from the API, or an error array
     */
    private function callApi($url, $postData) {
        error_log("=== CURL DEBUG START ===");
        error_log("URL: " . $url);
        error_log("POST Data: " . json_encode($postData));
        
        $ch = curl_init($url);

        // Set cURL options
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Content-Length: ' . strlen(json_encode($postData))
        ]);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30); // 30 second timeout
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10); // 10 second connection timeout

        // Execute the cURL request
        $response = curl_exec($ch);
        
        error_log("Raw Response: " . $response);

        // Check for cURL errors
        if (curl_errno($ch)) {
            $curlError = curl_error($ch);
            error_log('cURL Error calling ' . $url . ': ' . $curlError);
            curl_close($ch);
            return ['stats' => [], 'error' => 'cURL Error: ' . $curlError];
        }

        // Get HTTP status code and other info
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
        $totalTime = curl_getinfo($ch, CURLINFO_TOTAL_TIME);
        
        error_log('HTTP Code: ' . $httpCode);
        error_log('Content Type: ' . $contentType);
        error_log('Total Time: ' . $totalTime . 's');

        // Close cURL session
        curl_close($ch);

        // Check if response is empty
        if (empty($response)) {
            error_log('Empty response from API');
            return ['stats' => [], 'error' => 'Empty response from API'];
        }

        // Decode the JSON response
        $decodedResponse = json_decode($response, true);

        // Check for JSON decoding errors
        if (json_last_error() !== JSON_ERROR_NONE) {
            error_log('JSON Decode Error: ' . json_last_error_msg());
            error_log('Raw response: ' . $response);
            return ['stats' => [], 'error' => 'JSON Decode Error: ' . json_last_error_msg()];
        }

        error_log('Decoded Response: ' . json_encode($decodedResponse));

        // Check if the API call was successful
        if ($httpCode === 200) {
            if (is_array($decodedResponse) && isset($decodedResponse['stats'])) {
                error_log('API Call successful. Stats count: ' . count($decodedResponse['stats']));
                return $decodedResponse;
            } else {
                error_log('API returned 200 but unexpected format');
                error_log('Expected "stats" key, got: ' . json_encode(array_keys($decodedResponse ?: [])));
                return ['stats' => [], 'error' => 'Unexpected API response format'];
            }
        } else {
            error_log('API Error: HTTP ' . $httpCode);
            error_log('Response: ' . $response);
            return ['stats' => [], 'error' => 'API Error: HTTP ' . $httpCode];
        }
    }

    /**
     * Test API connectivity
     */
    public function testApiConnection() {
        $testUrl = $this->apiBaseUrl . 'GetPatientStatistics';
        $testData = [
            'startDate' => '2025-06-01',
            'endDate' => '2025-07-31',
            'groupType' => 'BY_MONTH'
        ];
        
        error_log("=== API CONNECTION TEST ===");
        $result = $this->callApi($testUrl, $testData);
        error_log("Test Result: " . json_encode($result));
        
        return $result;
    }
}