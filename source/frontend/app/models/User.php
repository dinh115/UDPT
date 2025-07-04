<?php
require_once __DIR__ . '/../services/ApiService.php';

class User extends ApiService
{

    public function getAllUsers($page = 1, $limit = 10)
    {
        try {
            $params = [];
            if ($limit && $limit != 10) {
                $params['_limit'] = $limit;
            }

            $response = $this->httpClient->get($this->endpoints['users'], $params);
            return $this->handleResponse($response);
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    public function getUserById($id)
    {
        try {
            $response = $this->httpClient->get($this->endpoints['users'] . '/' . $id);
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
}
