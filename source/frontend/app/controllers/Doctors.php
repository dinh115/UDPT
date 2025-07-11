<?php
class Doctors extends Controller
{

    public function index()
    {
        $data = [];
        if (isset($_SESSION['user_session']) && $_SESSION['user_session']['role'] === 'doctor') {
            $userId = $_SESSION['user_session']['user']['id'];
            $doctorModel = $this->model('Doctor');
            $result = $doctorModel->getDoctorByUserId($userId);
            if ($result['success']) {
                $data = [
                    'doctor' => $result['data']['doctor'],
                    'sessionDoctorId' => $result['data']['doctor']['id']
                ];
            }
        }
        $this->view('doctors/index', $data);
    }

    public function show($id = null)
    {
        if (!$id) {
            $this->redirect('/doctors');
            return;
        }

        $doctorModel = $this->model('Doctor');
        $result = $doctorModel->getDoctorById($id);



        //var_dump($result);
        if ($result['success']) {
            $data = [
                'title' => 'Chi tiết Bác sĩ',
                'doctor' => $result['data']['doctor'],
                'isProfileOwner' => $_SESSION['user_session']['role'] === 'doctor' && $_SESSION['user_session']['user']['id'] === $result['data']['doctor']['userId']
            ];
            $this->view('doctors/show', $data);
        } else {
            $this->renderError(
                'Không tìm thấy Bác sĩ',
                $result['error']
            );
            return;
        }
    }

    public function update($id = null)
    {
        if (!$id) {
            $this->redirect('/doctors');
            return;
        }

        // Lấy model Doctor
        $doctorModel = $this->model('Doctor');
        $result = $doctorModel->getDoctorById($id);

        // Kiểm tra quyền truy cập
        $userSession = $_SESSION['user_session'] ?? null;
        if (
            !$userSession || (
                $userSession['role'] !== 'admin' &&
                $userSession['role'] !== 'employee' &&
                $_SESSION['user_session']['user']['id'] !== $result['data']['doctor']['userId']
            )
        ) {
            // Không có quyền truy cập
            $this->redirect('/doctors'); // hoặc redirect về trang lỗi/404
            return;
        }

        //var_dump($result);
        if ($result['success']) {
            $data = [
                'title' => 'Chi tiết Bác sĩ',
                'doctor' => $result['data']['doctor']
            ];
            $this->view('doctors/update', $data);
        } else {
            $this->renderError(
                'Không tìm thấy Bác sĩ',
                $result['error']
            );
            return;
        }
    }

    public function api()
    {
        $doctorModel = $this->model('Doctor');
        $result = $doctorModel->getAllDoctor();
        $this->jsonResponse($result);
    }

    public function navbarToShow()
    {
        if (!isset($_SESSION['user_session']) || $_SESSION['user_session']['role'] !== 'doctor') {
            $this->redirect('/doctors');
            return;
        }

        $userId = $_SESSION['user_session']['user']['id'];
        $doctorModel = $this->model('Doctor');
        $result = $doctorModel->getDoctorByUserId($userId);

        if ($result['success'] && isset($result['data']['doctor']['id'])) {
            $doctorId = $result['data']['doctor']['id'];
            $this->redirect('/doctors/show/' . $doctorId);
        } else {
            $this->renderError('Không tìm thấy hồ sơ bác sĩ', 'Không thể lấy được ID bác sĩ từ user hiện tại.');
        }
    }

}
