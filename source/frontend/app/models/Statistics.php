<?php

class Statistics {
    private $apiBaseUrl = 'http://localhost:3000/api/analysis/';

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

        error_log("Calling API for Patient Stats: " . $endpoint . " with data: " . json_encode($postData));
        return $this->callApi($endpoint, $postData);
    }

    /**
     * Get prescription statistics based on filters
     * @param string $startDate The start date for the statistics (e.g., 'YYYY-MM-DD')
     * @param string $endDate The end date for the statistics (e.g., 'YYYY-MM-DD')
     * @param string $groupType The type of grouping (e.g., 'BY_DAY', 'BY_MONTH', 'BY_YEAR')
     * @return array An associative array containing prescription statistics
     */
    public function getPrescriptionStats($startDate, $endDate, $groupType) {
        // Assuming a similar endpoint for prescription statistics
        $endpoint = $this->apiBaseUrl . 'GetPrescriptionStatistics';
        $postData = [
            'startDate' => $startDate,
            'endDate' => $endDate,
            'groupType' => $groupType
        ];

        error_log("Calling API for Prescription Stats: " . $endpoint . " with data: " . json_encode($postData));
        return $this->callApi($endpoint, $postData);
    }

    /**
     * Helper function to make API calls
     * @param string $url The API endpoint URL
     * @param array $postData The data to send in the POST request body
     * @return array The decoded JSON response from the API, or an error array
     */
    private function callApi($url, $postData) {
        $ch = curl_init($url);

        // Set cURL options
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // Return the response as a string
        curl_setopt($ch, CURLOPT_POST, true);           // Set as POST request
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData)); // Encode data as JSON
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Content-Length: ' . strlen(json_encode($postData))
        ]);

        // Execute the cURL request
        $response = curl_exec($ch);

        // Check for cURL errors
        if (curl_errno($ch)) {
            $curlError = curl_error($ch);
            error_log('cURL Error calling ' . $url . ': ' . $curlError);
            curl_close($ch);
            return ['stats' => []]; // Return empty stats on error
        }

        // Get HTTP status code
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        error_log('API Response HTTP Code from ' . $url . ': ' . $httpCode);

        // Close cURL session
        curl_close($ch);

        // Decode the JSON response
        $decodedResponse = json_decode($response, true);

        // Check for JSON decoding errors
        if (json_last_error() !== JSON_ERROR_NONE) {
            error_log('JSON Decode Error from ' . $url . ': ' . json_last_error_msg() . ' Raw response: ' . $response);
            return ['stats' => []];
        }

        // Check if the API call was successful (e.g., HTTP 200 OK) and response is valid
        if ($httpCode === 200 && is_array($decodedResponse) && isset($decodedResponse['stats'])) {
            error_log('API Call to ' . $url . ' successful. Response: ' . json_encode($decodedResponse));
            return $decodedResponse;
        } else {
            // Log or handle API specific errors (e.g., non-200 status, invalid JSON structure)
            error_log('API Error: Unexpected response from ' . $url . '. HTTP Code: ' . $httpCode . ' Raw response: ' . $response);
            return ['stats' => []]; // Return empty stats on error
        }
    }
}
