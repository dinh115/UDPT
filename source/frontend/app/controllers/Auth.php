<?php
require_once '../app/services/AuthService.php';

class Auth extends Controller
{
    private $authService;

    public function __construct()
    {
        $this->authService = new AuthService();
    }

    public function index()
    {
        $this->view('home/index');
    }

    public function login()
    {
        // If already logged in, redirect to dashboard
        if ($this->authService->isLoggedIn()) {
            $this->redirect('/home');
        }

        $data = [
            'title' => 'Medportal - Login',
            'error' => null
        ];

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $username = trim($_POST['username'] ?? '');
            $password = trim($_POST['password'] ?? '');

            // Basic validation
            if (empty($username) || empty($password)) {
                $data['error'] = 'Vui lòng nhập tài khoản và mật khẩu';
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
                        'error' => match (true) {
                            $result['status_code'] == 500 => 'Tên người dùng hoặc mật khẩu không chính xác',
                            $result['error'] !== true => $result['error'],
                            default => 'Lỗi hệ thống'
                        }
                    ];
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

    public function register()
    {
        // If already logged in, redirect to dashboard
        if ($this->authService->isLoggedIn()) {
            $this->redirect('/home');
        }

        $data = [
            'title' => 'MedPortal - Register',
            'error' => null
        ];

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Lấy dữ liệu từ form
            $username = trim($_POST['username'] ?? '');
            $email = trim($_POST['email'] ?? '');
            $firstName = trim($_POST['firstName'] ?? '');
            $lastName = trim($_POST['lastName'] ?? '');
            $full_name = trim($lastName . ' ' . $firstName); // gộp họ tên
            $dateOfBirth = trim($_POST['dateOfBirth'] ?? '');
            $address = trim($_POST['address'] ?? '');
            $phone = trim($_POST['phone'] ?? '');
            $password = trim($_POST['password'] ?? '');
            $confirm_password = trim($_POST['confirmedPassword'] ?? '');

            // Kiểm tra lỗi
            $errors = [];

            if (empty($username)) {
                $errors[] = 'Tên người dùng không được để trống';
            } elseif (strlen($username) < 3) {
                $errors[] = 'Tên người dùng phải có ít nhất 3 ký tự';
            } elseif (!preg_match('/^[a-zA-Z0-9_]+$/', $username)) {
                $errors[] = 'Tên người dùng chỉ được chứa chữ cái, số và dấu gạch dưới';
            }

            if (empty($email)) {
                $errors[] = 'Email không được để trống';
            } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $errors[] = 'Email không hợp lệ';
            }

            if (empty($lastName) || empty($firstName)) {
                $errors[] = 'Họ và tên không được để trống';
            } elseif (strlen($full_name) < 2) {
                $errors[] = 'Họ và tên phải có ít nhất 2 ký tự';
            }

            if (empty($dateOfBirth)) {
                $errors[] = 'Vui lòng nhập ngày sinh';
            }

            if (empty($address)) {
                $errors[] = 'Địa chỉ không được để trống';
            }

            if (empty($phone)) {
                $errors[] = 'Số điện thoại không được để trống';
            } elseif (!preg_match('/^\+?[0-9]{9,15}$/', $phone)) {
                $errors[] = 'Số điện thoại không hợp lệ';
            }

            if (empty($password)) {
                $errors[] = 'Mật khẩu không được để trống';
            } elseif (strlen($password) < 6) {
                $errors[] = 'Mật khẩu phải có ít nhất 6 ký tự';
            }

            if ($password !== $confirm_password) {
                $errors[] = 'Mật khẩu xác nhận không khớp';
            }

            if (!empty($errors)) {
                $data['errors'] = $errors;
            } else {
                // Gọi service đăng ký
                $result = $this->authService->register(
                    $username,
                    $email,
                    $firstName,
                    $lastName,
                    $password,
                    $dateOfBirth,
                    $address,
                    $phone
                );
                //var_dump(json_encode($result));
                if ($result['success']) {
                    $this->redirect('/auth/login?msg=registered');
                } else {
                    $data['errors'] = [$result['error']];
                }
            }
        }

        $this->view('auth/register', $data);
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
