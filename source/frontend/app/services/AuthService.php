<?php
require_once __DIR__ . '/ApiService.php';

class AuthService extends ApiService
{
    private $sessionKey = 'user_session';

    public function __construct()
    {
        parent::__construct();
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
    }

    public function login($username, $password)
    {
        $loginData = [
            'username' => $username,
            'password' => $password
        ];

        $response = $this->httpClient->post($this->endpoints['login'], $loginData);

        $result = $this->handleResponse($response);
        if ($result['success']) {
            // Store user data and token in session
            $_SESSION[$this->sessionKey] = [
                'token' => $result['data']['token'] ?? null,
                'user' => $result['data']['user'] ?? null,
                'role' => $result['data']['user']['role'] ?? [],
                'logged_in' => true,
                'login_time' => time()
            ];

            return [
                'success' => true,
                'user' => $result['data']['user'],
                'token' => $result['data']['token']
            ];
        }

        return [
            'success' => false,
            'error' => $result['error']
        ];
    }

    public function logout()
    {
        $token = $this->getToken();

        if ($token) {
            // Call logout API
            $headers = ['Authorization' => 'Bearer ' . $token];
            $response = $this->httpClient->delete($this->endpoints['logout'], $headers);
        }

        // Clear session regardless of API response
        unset($_SESSION[$this->sessionKey]);

        return ['success' => true];
    }

    public function isLoggedIn()
    {
        return isset($_SESSION[$this->sessionKey]) && $_SESSION[$this->sessionKey]['logged_in'];
    }

    public function getUser()
    {

        if ($this->isLoggedIn()) {
            return $_SESSION[$this->sessionKey]['user'];
        }
        return null;
    }

    public function getToken()
    {
        if ($this->isLoggedIn()) {
            return $_SESSION[$this->sessionKey]['token'];
        }
        return null;
    }

    public function getUserRole()
    {
        if ($this->isLoggedIn()) {
            return $_SESSION[$this->sessionKey]['role'];
        }
        return [];
    }

    public function requireLogin()
    {
        if (!$this->isLoggedIn()) {
            header('Location: /auth/login');
            exit;
        }
    }
}
