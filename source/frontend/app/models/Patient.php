<?php
require_once __DIR__ . '/../services/ApiService.php';

class Patient extends ApiService
{
    public function getVisitHistory($userId)
    {
        try {
            $endpoint = $this->endpoints['patient'] . '/listvisits/' . $userId;
            $response = $this->httpClient->get($endpoint);
            return $this->handleResponse($response);
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => 'Không thể tải lịch sử khám bệnh: ' . $e->getMessage()
            ];
        }
    }

    public function getVisitDetail($visitId)
    {
        try {
            $endpoint = $this->endpoints['patient'] . '/getVisit/' . $visitId;
            $response = $this->httpClient->get($endpoint);
            return $this->handleResponse($response);
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => 'Không thể tải chi tiết lượt khám: ' . $e->getMessage()
            ];
        }
    }

    public function createVisit($data)
    {
        try {
            $endpoint = $this->endpoints['patient'] . '/createvisit/';
            $response = $this->httpClient->post($endpoint, $data);
            return $this->handleResponse($response);
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => 'Không thể tạo lượt khám mới: ' . $e->getMessage()
            ];
        }
    }

    public function updateVisit($visitId, $data)
    {
        try {
            $endpoint = $this->endpoints['patient'] . '/' . $visitId;
            $response = $this->httpClient->put($endpoint, $data);
            return $this->handleResponse($response);
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => 'Không thể cập nhật lượt khám: ' . $e->getMessage()
            ];
        }
    }

    public function checkPatientService()
    {
        try {
            $endpoint = $this->endpoints['patient'] . '/check';
            $response = $this->httpClient->get($endpoint);
            return $this->handleResponse($response);
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => 'Không thể kiểm tra dịch vụ bệnh nhân: ' . $e->getMessage()
            ];
        }
    }

    public function formatVisitForDisplay($visit)
    {
        return [
            'id' => $visit['id'] ?? '',
            'visit_date' => $this->formatDate($visit['visit_date'] ?? ''),
            'department' => $visit['department'] ?? '',
            'doctor' => $visit['doctor'] ?? '',
            'reason_for_visit' => $visit['reason_for_visit'] ?? '',
            'diagnosis' => $visit['diagnosis'] ?? [],
            'vital_signs' => $visit['vital_signs'] ?? [],
            'tests' => $visit['tests'] ?? [],
            'prescription_id' => $visit['prescription_id'] ?? '',
            'notes' => $visit['notes'] ?? ''
        ];
    }

    private function formatDate($dateString)
    {
        if (empty($dateString)) {
            return '';
        }

        try {
            $date = new DateTime($dateString);
            return $date->format('d/m/Y H:i');
        } catch (Exception $e) {
            return $dateString;
        }
    }

    public function getDiagnosisDescription($diagnosis)
    {
        if (empty($diagnosis)) {
            return '';
        }

        $descriptions = [];
        foreach ($diagnosis as $diag) {
            if (isset($diag['description'])) {
                $descriptions[] = $diag['description'];
            }
        }

        return implode(', ', $descriptions);
    }

    public function formatVitalSigns($vitalSigns)
    {
        if (empty($vitalSigns)) {
            return [];
        }

        $formatted = [];

        if (isset($vitalSigns['temperature'])) {
            $formatted['Nhiệt độ'] = $vitalSigns['temperature'] . '°C';
        }

        if (isset($vitalSigns['blood_pressure'])) {
            $formatted['Huyết áp'] = $vitalSigns['blood_pressure'] . ' mmHg';
        }

        if (isset($vitalSigns['pulse'])) {
            $formatted['Nhịp tim'] = $vitalSigns['pulse'] . ' bpm';
        }

        if (isset($vitalSigns['respiratory_rate'])) {
            $formatted['Nhịp thở'] = $vitalSigns['respiratory_rate'] . ' lần/phút';
        }

        if (isset($vitalSigns['weight'])) {
            $formatted['Cân nặng'] = $vitalSigns['weight'] . ' kg';
        }

        if (isset($vitalSigns['height'])) {
            $formatted['Chiều cao'] = $vitalSigns['height'] . ' cm';
        }

        return $formatted;
    }
}
