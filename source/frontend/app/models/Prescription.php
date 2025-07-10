<?php
require_once __DIR__ . '/../services/ApiService.php';

class Prescription extends ApiService
{
    public function getAllPrescriptions()
    {
        try {
            $endpoint = $this->endpoints['medicine'] . '/GetAllPrescriptions';
            $response = $this->httpClient->get($endpoint);
            return $this->handleResponse($response);
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => 'Không thể tải danh sách đơn thuốc: ' . $e->getMessage()
            ];
        }
    }

    public function getPrescriptionById($prescriptionId)
    {
        try {
            $endpoint = $this->endpoints['medicine'] . '/GetPrescriptionById/' . $prescriptionId;
            $response = $this->httpClient->get($endpoint);
            return $this->handleResponse($response);
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => 'Không thể tải thông tin đơn thuốc: ' . $e->getMessage()
            ];
        }
    }

    public function createPrescription($data)
    {
        try {
            $endpoint = $this->endpoints['medicine'] . '/CreatePrescription';
            $response = $this->httpClient->post($endpoint, $data);
            return $this->handleResponse($response);
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => 'Không thể tạo đơn thuốc mới: ' . $e->getMessage()
            ];
        }
    }

    public function updatePrescription($prescriptionId, $data)
    {
        try {
            $endpoint = $this->endpoints['medicine'] . '/UpdatePrescription/' . $prescriptionId;
            $response = $this->httpClient->put($endpoint, $data);
            return $this->handleResponse($response);
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => 'Không thể cập nhật đơn thuốc: ' . $e->getMessage()
            ];
        }
    }

    public function deletePrescription($prescriptionId)
    {
        try {
            $endpoint = $this->endpoints['medicine'] . '/DeletePrescription/' . $prescriptionId;
            $response = $this->httpClient->put($endpoint);
            return $this->handleResponse($response);
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => 'Không thể xóa đơn thuốc: ' . $e->getMessage()
            ];
        }
    }
}