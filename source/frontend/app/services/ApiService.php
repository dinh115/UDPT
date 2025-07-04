<?php
require_once __DIR__ . '/HttpClient.php';

class ApiService
{
    protected $httpClient;
    protected $endpoints;

    public function __construct()
    {
        $this->httpClient = new HttpClient();
        $config = $this->loadConfig();
        $this->endpoints = $config['endpoints'] ?? [];
    }

    private function loadConfig()
    {
        $configPath = __DIR__ . '/../../config/api.php';
        if (file_exists($configPath)) {
            return include $configPath;
        }
        return ['endpoints' => []];
    }

    protected function handleResponse($response)
    {
        $data = isset($response['data']) && is_array($response['data']) ? $response['data'] : [];
        $error = isset($response['error']) ? $response['error'] : null;

        if (
            isset($data['success'], $data['error'], $data['message']) &&
            !$data['success'] && $data['error'] && $data['message']
        ) {
            $fullMessage = $data['message'] ?? '';
            $parts = explode(':', $fullMessage);
            $finalMessage = trim(end($parts)); // lấy phần cuối và loại bỏ khoảng trắng
            return [
                'success' => false,
                'error' => $finalMessage,
                'status_code' => $response['status_code']
            ];
        }

        if (isset($data['error']) && $data['error']) {
            return [
                'success' => false,
                'error' => $data['error'],
                'status_code' => $response['status_code']
            ];
        }

        if ($error) {
            return [
                'success' => false,
                'error' => $error,
                'status_code' => $response['status_code']
            ];
        }

        if (isset($response['status_code']) && $response['status_code'] >= 200 && $response['status_code'] < 300) {
            return [
                'success' => true,
                'data' => $data,
                'status_code' => $response['status_code']
            ];
        } else {
            return [
                'success' => false,
                'error' => $data['message'] ?? 'API request failed',
                'status_code' => $response['status_code']
            ];
        }
    }
}
