<?php

class Medicine extends Controller
{
    public function index()
    {
        $this->view('medicine/index');
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