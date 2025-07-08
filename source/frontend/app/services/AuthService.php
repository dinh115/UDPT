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

    private array $errorTranslations = [
        'User with this username already exists' => 'Tên người dùng đã tồn tại',
        'email already exists' => 'Email đã được sử dụng',
        'password must be at least' => 'Mật khẩu quá ngắn',
    ];

    protected function translateError(string $message): string
    {
        foreach ($this->errorTranslations as $en => $vi) {
            if (str_contains($message, $en)) {
                return $vi;
            }
        }
        return $message; // fallback
    }
    public function login($username, $password)
    {
        $loginData = [
            'username' => $username,
            'password' => $password
        ];

        $response = $this->httpClient->post($this->endpoints['login'], $loginData);
        $result = $this->handleResponse($response);
        //var_dump($result);
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
            'error' => $this->translateError($result['error']),
            'status_code' => $result['status_code']
        ];
    }

    public function register($username, $email, $firstName, $lastName, $password, $dateOfBirth, $address, $phone)
    {
        $registerData = [
            'username' => $username,
            'email' => $email,
            'firstName' => $firstName,
            'lastName' => $lastName,
            'password' => $password,
            'dateOfBirth' => $dateOfBirth,
            'address' => $address,
            'phone' => $phone
        ];
        $response = $this->httpClient->post($this->endpoints['register'], $registerData);
        $result = $this->handleResponse($response);
        //var_dump(json_encode($result));

        if ($result['success']) {
            return [
                'success' => true,
                'message' => 'Đăng ký thành công',
                'user' => $result['data']['user'] ?? null
            ];
        }

        return [
            'success' => false,
            'error' => $this->translateError($result['error']),
            'status_code' => $result['status_code']
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
