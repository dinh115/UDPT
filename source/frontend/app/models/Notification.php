<?php

class Notification {
    private $apiBaseUrl = 'http://gateway:3000/api/notification/';

    public function __construct() {
        // No database connection needed as data will be fetched from API
    }

    /**
     * Get upcoming confirmed appointments from the API.
     * @return array An associative array containing appointment data.
     */
    public function getUpcomingConfirmedAppointments() {
        $endpoint = $this->apiBaseUrl . 'GetUpcomingConfirmedAppointments';

        error_log("Notification Model: Calling API for Upcoming Confirmed Appointments: " . $endpoint);
        
        try {
            $response = $this->callApi($endpoint, 'GET');
            error_log("Notification Model: getUpcomingConfirmedAppointments response: " . json_encode($response));
            
            // Ensure response has proper structure
            if (!is_array($response)) {
                error_log("Notification Model: Invalid response format - not an array");
                return ['success' => false, 'error' => 'Invalid response format', 'data' => []];
            }
            
            // If API returns data directly without success wrapper, wrap it
            if (isset($response[0]) && is_array($response[0])) {
                error_log("Notification Model: Response appears to be direct data array, wrapping in success structure");
                return ['success' => true, 'data' => $response];
            }
            
            // If response already has success structure, return as is
            if (isset($response['success'])) {
                return $response;
            }
            
            // Otherwise, assume it's data and wrap it
            return ['success' => true, 'data' => $response];
            
        } catch (Exception $e) {
            error_log("Notification Model: Exception in getUpcomingConfirmedAppointments: " . $e->getMessage());
            return ['success' => false, 'error' => $e->getMessage(), 'data' => []];
        }
    }

    /**
     * Send a reminder email for an appointment.
     * @param array $appointmentData The data for the appointment to send a reminder for.
     * @return array The decoded JSON response from the API.
     */
    public function sendReminder($appointmentData) {
        $endpoint = $this->apiBaseUrl . 'SendReminder';

        error_log("Notification Model: Calling API for Send Reminder: " . $endpoint . " with data: " . json_encode($appointmentData));
        
        try {
            $response = $this->callApi($endpoint, 'POST', $appointmentData);
            error_log("Notification Model: sendReminder response: " . json_encode($response));
            
            // Ensure response has proper structure
            if (!is_array($response)) {
                error_log("Notification Model: Invalid response format - not an array");
                return ['success' => false, 'error' => 'Invalid response format from API'];
            }
            
            // If response doesn't have success key, assume it failed
            if (!isset($response['success'])) {
                error_log("Notification Model: Response missing success key, assuming failure");
                return ['success' => false, 'error' => 'API response missing success indicator'];
            }
            
            return $response;
            
        } catch (Exception $e) {
            error_log("Notification Model: Exception in sendReminder: " . $e->getMessage());
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Helper function to make API calls
     * @param string $url The API endpoint URL
     * @param string $method The HTTP method (GET or POST)
     * @param array $postData The data to send in the POST request body (optional)
     * @return array The decoded JSON response from the API, or an error array
     */
    private function callApi($url, $method = 'GET', $postData = []) {
        // Validate URL
        if (!filter_var($url, FILTER_VALIDATE_URL)) {
            error_log("Notification Model: Invalid URL provided: " . $url);
            throw new Exception("Invalid API URL: " . $url);
        }

        $ch = curl_init();
        
        if (!$ch) {
            error_log("Notification Model: Failed to initialize cURL");
            throw new Exception("Failed to initialize cURL");
        }

        // Set cURL options
        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30, // Increased timeout
            CURLOPT_CONNECTTIMEOUT => 10,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_MAXREDIRS => 5,
            CURLOPT_SSL_VERIFYPEER => false, // For development - remove in production
            CURLOPT_SSL_VERIFYHOST => false, // For development - remove in production
            CURLOPT_USERAGENT => 'MedPortal/1.0',
            CURLOPT_VERBOSE => true, // Enable verbose output for debugging
        ]);

        // Set up verbose output to error log
        $verbose = fopen('php://temp', 'w+');
        curl_setopt($ch, CURLOPT_STDERR, $verbose);

        if ($method === 'POST') {
            curl_setopt_array($ch, [
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => json_encode($postData),
                CURLOPT_HTTPHEADER => [
                    'Content-Type: application/json',
                    'Accept: application/json',
                    'Content-Length: ' . strlen(json_encode($postData))
                ]
            ]);
        } else { // GET request
            curl_setopt($ch, CURLOPT_HTTPGET, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Accept: application/json'
            ]);
        }

        // Execute the cURL request
        $response = curl_exec($ch);
        
        // Get verbose output
        rewind($verbose);
        $verboseLog = stream_get_contents($verbose);
        fclose($verbose);
        
        if (!empty($verboseLog)) {
            error_log("Notification Model: cURL verbose output: " . $verboseLog);
        }

        // Check for cURL errors
        if (curl_errno($ch)) {
            $curlError = curl_error($ch);
            $curlErrno = curl_errno($ch);
            error_log("Notification Model: cURL Error #{$curlErrno} calling {$url}: {$curlError}");
            curl_close($ch);
            throw new Exception("cURL Error #{$curlErrno}: {$curlError}");
        }

        // Get request info
        $info = curl_getinfo($ch);
        $httpCode = $info['http_code'];
        $totalTime = $info['total_time'];
        $connectTime = $info['connect_time'];
        
        error_log("Notification Model: API Call Info - URL: {$url}, HTTP Code: {$httpCode}, Total Time: {$totalTime}s, Connect Time: {$connectTime}s");
        error_log("Notification Model: Raw API Response from {$url}: " . $response);

        // Close cURL session
        curl_close($ch);

        // Handle HTTP errors
        if ($httpCode >= 400) {
            error_log("Notification Model: HTTP Error {$httpCode} from {$url}");
            throw new Exception("HTTP Error {$httpCode} from API");
        }

        // Check if response is empty
        if (empty($response)) {
            error_log("Notification Model: Empty response from {$url}");
            throw new Exception("Empty response from API");
        }

        // Decode the JSON response
        $decodedResponse = json_decode($response, true);

        // Check for JSON decoding errors
        if (json_last_error() !== JSON_ERROR_NONE) {
            $jsonError = json_last_error_msg();
            error_log("Notification Model: JSON Decode Error from {$url}: {$jsonError}. Raw response: " . $response);
            throw new Exception("JSON Decode Error: {$jsonError}");
        }

        error_log("Notification Model: Successfully decoded API response from {$url}");
        
        return $decodedResponse;
    }
}