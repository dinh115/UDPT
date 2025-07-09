<?php
require_once __DIR__ . '/../services/ApiService.php';

class Doctor extends ApiService
{

    public function findDoctors($page = 1, $limit = 10)
    {
        try {
            $params = [];
            if ($limit && $limit != 10) {
                $params['_limit'] = $limit;
            }

            $response = $this->httpClient->get($this->endpoints['doctors'], $params);
            return $this->handleResponse($response);
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    public function createUser($userData)
    {
        try {
            $response = $this->httpClient->post($this->endpoints['users'], $userData);
            return $this->handleResponse($response);
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    public function createDoctorProfile($doctorData)
    {
        try {
            $endpoint = $this->endpoints['create_doctor'] ?? '/doctors/create'; // fallback nếu chưa config
            $response = $this->httpClient->post($endpoint, $doctorData);
            return $this->handleResponse($response);
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    public function updateDoctorProfile($doctorData)
    {
        try {
            $endpoint = $this->endpoints['update_doctor'] ?? '/doctors/update'; // fallback nếu chưa config
            $response = $this->httpClient->post($endpoint, $doctorData);
            return $this->handleResponse($response);
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    public function updateDoctorVailability($doctorData)
    {
        try {
            $endpoint = $this->endpoints['update_doctor_availability'] ?? '/doctors/update'; // fallback nếu chưa config
            $response = $this->httpClient->post($endpoint, $doctorData);
            return $this->handleResponse($response);
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    public function getDoctorById($id)
    {
        try {
            $endpoint = $this->endpoints['doctor_get_id'] ?? '/api/doctor/GetDoctorById'; // fallback nếu chưa config
            $response = $this->httpClient->get($endpoint . '/' . $id);
            return $this->handleResponse($response);
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }


}
