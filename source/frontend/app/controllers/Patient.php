<?php
class Patient extends Controller
{
    private $patientModel;
    private $userModel;

    public function __construct()
    {
        // Check if user is logged in
        if (!isset($_SESSION['user_id'])) {
            $this->redirect('/auth/login');
        }

        $this->patientModel = $this->model('Patient');
        $this->userModel = $this->model('User');
    }

    public function index()
    {
        try {
            // Get user info
            $userId = $_SESSION['user_id'];
            $userInfo = $this->userModel->getUserById($userId);

            // Get patient visit history
            $visitHistory = $this->patientModel->getVisitHistory($userId);

            $data = [
                'title' => 'Thông Tin Bệnh Nhân',
                'userInfo' => $userInfo,
                'visitHistory' => $visitHistory
            ];

            $this->view('patient/index', $data);
        } catch (Exception $e) {
            $this->renderError('Lỗi', 'Không thể tải thông tin bệnh nhân', $e->getMessage());
        }
    }

    public function info()
    {
        try {
            $userId = $_SESSION['user_id'];
            $userInfo = $this->userModel->getUserById($userId);

            $data = [
                'title' => 'Thông Tin Cá Nhân',
                'userInfo' => $userInfo
            ];

            $this->view('patient/info', $data);
        } catch (Exception $e) {
            $this->renderError('Lỗi', 'Không thể tải thông tin cá nhân', $e->getMessage());
        }
    }

    public function history()
    {
        try {
            $userId = $_SESSION['user_id'];
            $visitHistory = $this->patientModel->getVisitHistory($userId);

            $data = [
                'title' => 'Lịch Sử Khám Bệnh',
                'visitHistory' => $visitHistory
            ];

            $this->view('patient/history', $data);
        } catch (Exception $e) {
            $this->renderError('Lỗi', 'Không thể tải lịch sử khám bệnh', $e->getMessage());
        }
    }

    public function detail($visitId)
    {
        if (!$visitId) {
            $this->renderError('Lỗi', 'ID lượt khám không hợp lệ');
            return;
        }

        try {
            $visitDetail = $this->patientModel->getVisitDetail($visitId);
            
            if (!$visitDetail) {
                $this->renderError('Lỗi', 'Không tìm thấy thông tin lượt khám');
                return;
            }

            // Check if this visit belongs to current user
            if ($visitDetail['patient'] !== $_SESSION['user_id']) {
                $this->renderError('Lỗi', 'Không có quyền truy cập thông tin này');
                return;
            }

            $data = [
                'title' => 'Chi Tiết Lượt Khám',
                'visitDetail' => $visitDetail
            ];

            $this->view('patient/detail', $data);
        } catch (Exception $e) {
            $this->renderError('Lỗi', 'Không thể tải chi tiết lượt khám', $e->getMessage());
        }
    }

    // API endpoints for AJAX requests
    public function getVisitHistory()
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->jsonResponse(['error' => 'Method not allowed'], 405);
        }

        try {
            $userId = $_SESSION['user_id'];
            $visitHistory = $this->patientModel->getVisitHistory($userId);
            $this->jsonResponse(['success' => true, 'data' => $visitHistory]);
        } catch (Exception $e) {
            $this->jsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function getVisitDetail()
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->jsonResponse(['error' => 'Method not allowed'], 405);
        }

        $visitId = $_GET['id'] ?? null;
        if (!$visitId) {
            $this->jsonResponse(['success' => false, 'error' => 'ID lượt khám không hợp lệ'], 400);
        }

        try {
            $visitDetail = $this->patientModel->getVisitDetail($visitId);
            
            if (!$visitDetail) {
                $this->jsonResponse(['success' => false, 'error' => 'Không tìm thấy thông tin lượt khám'], 404);
            }

            // Check if this visit belongs to current user
            if ($visitDetail['patient'] !== $_SESSION['user_id']) {
                $this->jsonResponse(['success' => false, 'error' => 'Không có quyền truy cập'], 403);
            }

            $this->jsonResponse(['success' => true, 'data' => $visitDetail]);
        } catch (Exception $e) {
            $this->jsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }
}