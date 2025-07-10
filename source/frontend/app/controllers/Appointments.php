<?php
require_once '../app/services/AuthService.php';

class Appointments extends Controller
{
    private $authService;


    public function __construct()
    {
        $this->authService = new AuthService();
    }
    public function index()
    {
        $this->view('appointments/index');
    }

    public function my()
    {
        if (!$this->authService->isLoggedIn()) {
            $previousUrl = $_SERVER['HTTP_REFERER'] ?? '/home';
            $this->redirect($previousUrl);
        }

        $this->view('appointments/my', [
            "title" => "MEDPORTAL - " . $_SESSION['user_session']['role'] === "admin" || $_SESSION['user_session']['role'] === "employee" ?
                "Xem lịch hẹn" : "Lịch hẹn của tôi"
        ]);
    }
}
