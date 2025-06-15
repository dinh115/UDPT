<?php
require_once __DIR__ . '/../services/ApiService.php';

class Post extends ApiService {
    
    public function getAllPosts($filters = []) {
        try {
            $response = $this->httpClient->get($this->endpoints['posts'], $filters);
            return $this->handleResponse($response);
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }
    
    public function getPostsByUser($userId) {
        try {
            $params = ['userId' => $userId];
            $response = $this->httpClient->get($this->endpoints['posts'], $params);
            return $this->handleResponse($response);
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }
}