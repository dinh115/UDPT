<?php
// filepath: d:\UDPT\source\frontend\app\controllers\Prescription.php

class Prescription extends Controller
{
    public function index()
    {
        if (isset($_SESSION['user_session']) && $_SESSION['user_session']['role'] === 'employee') {
            $this->view('prescription/index');
        } else {
            $this->renderError('Lỗi', 'Bạn không có quyền truy cập vào trang này');
        }
    }

    public function show($id)
    {
        if (!$id) {
            $this->renderError('Lỗi', 'ID đơn thuốc không hợp lệ');
            return;
        }

        $prescriptionModel = $this->model('Prescription');
        $result = $prescriptionModel->getPrescriptionById($id);
        
        if ($result['success']) {
            $data = [
                'title' => 'Chi tiết Đơn thuốc',
                'prescription' => $result['data']
            ];
            $this->view('prescription/show', $data);
        } else {
            $this->renderError(
                'Không tìm thấy Đơn thuốc',
                $result['error']
            );
        }
    }

    public function api()
    {
        $prescriptionModel = $this->model('Prescription');
        $result = $prescriptionModel->getAllPrescriptions();
        $this->jsonResponse($result);
    }
}