<?php
class HttpClient {
    private $baseUrl;
    private $defaultHeaders;
    private $timeout;
    
    public function __construct($config = []) {
        $apiConfig = $this->loadConfig();
        
        $this->baseUrl = $config['base_url'] ?? $apiConfig['base_url'];
        $this->defaultHeaders = $config['headers'] ?? $apiConfig['headers'];
        $this->timeout = $config['timeout'] ?? $apiConfig['timeout'];
    }
    
    private function loadConfig() {
        $configPath = __DIR__ . '/../../config/api.php';
        if(file_exists($configPath)) {
            return include $configPath;
        }
        
        // Fallback config
        return [
            'base_url' => 'https://jsonplaceholder.typicode.com',
            'timeout' => 30,
            'headers' => [
                'Content-Type' => 'application/json',
                'Accept' => 'application/json'
            ]
        ];

        // return throw new Error('API configuration file not found.');
    }
    
    public function get($endpoint, $params = [], $headers = []) {
        $url = $this->baseUrl . $endpoint;
        if (!empty($params)) {
            $url .= '?' . http_build_query($params);
        }
        
        return $this->makeRequest('GET', $url, null, $headers);
    }
    
    public function post($endpoint, $data = [], $headers = []) {
        $url = $this->baseUrl . $endpoint;
        return $this->makeRequest('POST', $url, $data, $headers);
    }
    
    public function put($endpoint, $data = [], $headers = []) {
        $url = $this->baseUrl . $endpoint;
        return $this->makeRequest('PUT', $url, $data, $headers);
    }
    
    public function delete($endpoint, $headers = []) {
        $url = $this->baseUrl . $endpoint;
        return $this->makeRequest('DELETE', $url, null, $headers);
    }
    
    private function makeRequest($method, $url, $data = null, $headers = []) {
        $ch = curl_init();
        
        // Merge headers
        $requestHeaders = array_merge($this->defaultHeaders, $headers);
        $headerArray = [];
        foreach ($requestHeaders as $key => $value) {
            $headerArray[] = $key . ': ' . $value;
        }
        
        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => $this->timeout,
            CURLOPT_HTTPHEADER => $headerArray,
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_FOLLOWLOCATION => true
        ]);
        
        if ($data && in_array($method, ['POST', 'PUT', 'PATCH'])) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);
        
        if ($error) {
            return [
                'status_code' => 0,
                'data' => null,
                'error' => 'cURL Error: ' . $error,
                'raw_response' => null
            ];
        }
        
        return [
            'status_code' => $httpCode,
            'data' => json_decode($response, true),
            'error' => null,
            'raw_response' => $response
        ];
    }
}
