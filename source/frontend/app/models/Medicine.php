<?php
require_once __DIR__ . '/../services/ApiService.php';

class Medicine extends ApiService
{
    public function getAllMedicines()
    {
        try {
            $endpoint = $this->endpoints['medicine'] . '/GetAllMedicines';
            $response = $this->httpClient->get($endpoint);
            return $this->handleResponse($response);
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => 'Không thể tải danh sách thuốc: ' . $e->getMessage()
            ];
        }
    }

    public function getMedicineById($medicineId)
    {
        try {
            $endpoint = $this->endpoints['medicine'] . '/GetMedicineById/' . $medicineId;
            $response = $this->httpClient->get($endpoint);
            return $this->handleResponse($response);
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => 'Không thể tải thông tin thuốc: ' . $e->getMessage()
            ];
        }
    }

    public function createMedicine($data)
    {
        try {
            $endpoint = $this->endpoints['medicine'] . '/CreateMedicine';
            $response = $this->httpClient->post($endpoint, $data);
            return $this->handleResponse($response);
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => 'Không thể tạo thuốc mới: ' . $e->getMessage()
            ];
        }
    }

    public function updateMedicine($medicineId, $data)
    {
        try {
            // Sửa endpoint: không có ID trong URL, ID sẽ ở trong body
            $endpoint = $this->endpoints['medicine'] . '/UpdateMedicine';
            
            // Chuẩn bị data theo UpdateMedicineRequest format
            $requestData = [
                'medicine_id' => $medicineId,
                'name' => $data['name'],
                'unit' => $data['unit'],
                'supplier' => $data['supplier'],
                'price' => (float)$data['price'],
                'stock_quantity' => (int)$data['stock_quantity']
            ];
            
            $response = $this->httpClient->put($endpoint, $requestData);
            return $this->handleResponse($response);
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => 'Không thể cập nhật thuốc: ' . $e->getMessage()
            ];
        }
    }

    public function deleteMedicine($medicineId)
    {
        try {
            $endpoint = $this->endpoints['medicine'] . '/DeleteMedicine/' . $medicineId;
            $response = $this->httpClient->delete($endpoint);
            return $this->handleResponse($response);
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => 'Không thể xóa thuốc: ' . $e->getMessage()
            ];
        }
    }

    public function restoreMedicine($medicineId)
    {
        try {
            $endpoint = $this->endpoints['medicine'] . '/RestoreMedicine/' . $medicineId;
            $response = $this->httpClient->put($endpoint, []);
            return $this->handleResponse($response);
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => 'Không thể khôi phục thuốc: ' . $e->getMessage()
            ];
        }
    }
}