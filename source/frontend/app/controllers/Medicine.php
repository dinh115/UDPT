<?php

class Medicine extends Controller
{
    public function index()
    {
        if (isset($_SESSION['user_session']) && $_SESSION['user_session']['role'] === 'employee') {
            $this->view('medicine/index');
        } else {
            $this->renderError('Lỗi', 'Bạn không có quyền truy cập vào trang này');
        }
    }

    public function show($id)
    {
        if (!$id) {
            $this->renderError('Lỗi', 'ID thuốc không hợp lệ');
            return;
        }

        $medicineModel = $this->model('Medicine');
        $result = $medicineModel->getMedicineById($id);
        
        if ($result['success']) {
            $data = [
                'title' => 'Chi tiết Thuốc',
                'medicine' => $result['data']
            ];
            $this->view('medicine/show', $data);
        } else {
            $this->renderError(
                'Không tìm thấy Thuốc',
                $result['error']
            );
        }
    }

    public function update($id)
    {
        if (!$id) {
            $this->renderError('Lỗi', 'ID thuốc không hợp lệ');
            return;
        }

        $medicineModel = $this->model('Medicine');
        $result = $medicineModel->getMedicineById($id);
        
        if ($result['success']) {
            $data = [
                'title' => 'Cập nhật Thuốc',
                'medicine' => $result['data']
            ];
            $this->view('medicine/update', $data);
        } else {
            $this->renderError(
                'Không tìm thấy Thuốc',
                $result['error']
            );
        }
    }

    public function api()
    {
        $medicineModel = $this->model('Medicine');
        $result = $medicineModel->getAllMedicines();
        $this->jsonResponse($result);
    }
}