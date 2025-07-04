<?php
require_once '../app/services/AuthService.php';

class Auth extends Controller
{
    private $authService;

    public function __construct()
    {
        $this->authService = new AuthService();
    }

    public function login()
    {
        // If already logged in, redirect to dashboard
        if ($this->authService->isLoggedIn()) {
            $this->redirect('/home/about');
        }


        $data = [
            'title' => 'Login',
            'error' => null
        ];

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $username = trim($_POST['username'] ?? '');
            $password = trim($_POST['password'] ?? '');

            // Basic validation
            if (empty($username) || empty($password)) {
                $data['error'] = 'Username and password are required';
            } else {
                $result = $this->authService->login($username, $password);
                if ($result['success']) {
                    // Redirect to dashboard or intended page
                    $redirect = $_GET['redirect'] ?? '/home';
                    $this->redirect($redirect);
                } else {
                    // Set error message to be displayed in the view
                    $data = [
                        'title' => 'Login',
                        'error' => $result['error'] ?? 'Invalid username or password'
                    ];

                    $this->view('auth/login', $data);
                }
            }
        }

        $this->view('auth/login', $data);
    }

    public function logout()
    {
        $this->authService->logout();
        $this->redirect('/auth/login?msg=logged_out');
    }

    public function unauthorized()
    {
        $data = [
            'title' => 'Unauthorized',
            'error' => 'Access Denied',
            'message' => 'You do not have permission to access this resource.'
        ];

        $this->view('auth/unauthorized', $data);
    }

    public function status()
    {
        // API endpoint to check authentication status
        $response = [
            'logged_in' => $this->authService->isLoggedIn(),
            'user' => $this->authService->getUser(),
            'role' => $this->authService->getUserRole()
        ];

        $this->jsonResponse($response);
    }
}
