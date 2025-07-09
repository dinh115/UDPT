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
        $statusCode = $response['status_code'] ?? 500;
        $data = is_array($response['data'] ?? null) ? $response['data'] : [];
        $error = $response['error'] ?? null;

        // Ưu tiên xử lý lỗi rõ ràng từ message trong data
        if (!empty($data['error']) && !empty($data['message'])) {
            $finalMessage = $this->extractErrorMessage($data['message']);
            return [
                'success' => false,
                'error' => $finalMessage,
                'status_code' => $statusCode
            ];
        }

        // Nếu vẫn có error field
        if (!empty($data['error'])) {
            return [
                'success' => false,
                'error' => is_string($data['error']) ? $data['error'] : 'Lỗi không xác định',
                'status_code' => $statusCode
            ];
        }

        // Nếu field error ở ngoài
        if (!empty($error)) {
            return [
                'success' => false,
                'error' => is_string($error) ? $error : 'Lỗi hệ thống',
                'status_code' => $statusCode
            ];
        }

        // Nếu status code là thành công
        if ($statusCode >= 200 && $statusCode < 300) {
            return [
                'success' => true,
                'data' => $data,
                'status_code' => $statusCode
            ];
        }

        // Trường hợp còn lại là lỗi chung
        return [
            'success' => false,
            'error' => $data['message'] ?? 'Yêu cầu thất bại',
            'status_code' => $statusCode
        ];
    }

    protected function extractErrorMessage(string $message): string
    {
        // Tách theo dấu : và lấy phần cuối
        if (str_contains($message, ':')) {
            $parts = explode(':', $message);
            return trim(end($parts));
        }

        // Không có dấu :, trả luôn
        return trim($message);
    }
}
