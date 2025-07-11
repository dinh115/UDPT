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
        return $this->callApi($endpoint, 'GET');
    }

    /**
     * Send a reminder email for an appointment.
     * @param array $appointmentData The data for the appointment to send a reminder for.
     * @return array The decoded JSON response from the API.
     */
    public function sendReminder($appointmentData) {
        $endpoint = $this->apiBaseUrl . 'SendReminder';

        error_log("Notification Model: Calling API for Send Reminder: " . $endpoint . " with data: " . json_encode($appointmentData));
        return $this->callApi($endpoint, 'POST', $appointmentData);
    }

    /**
     * Helper function to make API calls
     * @param string $url The API endpoint URL
     * @param string $method The HTTP method (GET or POST)
     * @param array $postData The data to send in the POST request body (optional)
     * @return array The decoded JSON response from the API, or an error array
     */
    private function callApi($url, $method = 'GET', $postData = []) {
        $ch = curl_init($url);

        // Set cURL options
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // Return the response as a string
        curl_setopt($ch, CURLOPT_TIMEOUT, 10); // Set a timeout for the request (10 seconds)

        if ($method === 'POST') {
            curl_setopt($ch, CURLOPT_POST, true);           // Set as POST request
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData)); // Encode data as JSON
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
                'Content-Length: ' . strlen(json_encode($postData))
            ]);
        } else { // GET request
            curl_setopt($ch, CURLOPT_HTTPGET, true);
        }

        // Execute the cURL request
        $response = curl_exec($ch);

        // Check for cURL errors
        if (curl_errno($ch)) {
            $curlError = curl_error($ch);
            error_log('Notification Model: cURL Error calling ' . $url . ': ' . $curlError);
            curl_close($ch);
            return ['success' => false, 'error' => 'cURL Error: ' . $curlError]; // Return error
        }

        // Get HTTP status code
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        error_log('Notification Model: API Response HTTP Code from ' . $url . ': ' . $httpCode);
        error_log('Notification Model: Raw API Response from ' . $url . ': ' . $response); // Log raw response

        // Close cURL session
        curl_close($ch);

        // Decode the JSON response
        $decodedResponse = json_decode($response, true);

        // Check for JSON decoding errors
        if (json_last_error() !== JSON_ERROR_NONE) {
            error_log('Notification Model: JSON Decode Error from ' . $url . ': ' . json_last_error_msg() . ' Raw response: ' . $response);
            return ['success' => false, 'error' => 'JSON Decode Error: ' . json_last_error_msg()];
        }

        error_log('Notification Model: Decoded API Response from ' . $url . ': ' . json_encode($decodedResponse)); // Log decoded response

        // Return the decoded response, let the controller handle success/failure based on API's own 'success' flag
        return $decodedResponse;
    }
}
