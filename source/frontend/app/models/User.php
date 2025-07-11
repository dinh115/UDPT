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

        $headers = [];
        if (isset($_SESSION['user_session']['token'])) {
            $headers['authorization'] = 'Bearer ' . $_SESSION['user_session']['token'];
        }

        $response = $this->httpClient->get($this->endpoints['users'].'/getUsers/', $params, $headers);
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
            $params = [];
            $headers = [];
            if (isset($_SESSION['user_session']['token'])) {
                $headers['authorization'] = 'Bearer ' . $_SESSION['user_session']['token'];
            }

            $response = $this->httpClient->get($this->endpoints['users'] . '/getUser/' . $id,  $params, $headers);
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
