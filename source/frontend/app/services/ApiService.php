<?php
require_once __DIR__ . '/HttpClient.php';

class ApiService {
    protected $httpClient;
    protected $endpoints;
    
    public function __construct() {
        $this->httpClient = new HttpClient();
        $config = $this->loadConfig();
        $this->endpoints = $config['endpoints'] ?? [];
    }
    
    private function loadConfig() {
        $configPath = __DIR__ . '/../../config/api.php';
        if(file_exists($configPath)) {
            return include $configPath;
        }
        return ['endpoints' => []];
    }
    
    protected function handleResponse($response) {
        if ($response['error']) {
            return [
                'success' => false,
                'error' => $response['error'],
                'status_code' => $response['status_code']
            ];
        }
        
        if ($response['status_code'] >= 200 && $response['status_code'] < 300) {
            return [
                'success' => true,
                'data' => $response['data'],
                'status_code' => $response['status_code']
            ];
        } else {
            return [
                'success' => false,
                'error' => $response['data']['message'] ?? 'API request failed',
                'status_code' => $response['status_code']
            ];
        }
    }
}
