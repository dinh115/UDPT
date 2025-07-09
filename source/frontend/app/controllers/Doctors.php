<?php
class Doctors extends Controller
{

    public function index()
    {
        $this->view('doctors/index');
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
                'doctor' => $result['data']['doctor']
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

        $doctorModel = $this->model('Doctor');
        $result = $doctorModel->getDoctorById($id);
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


    public function delete()
    {
        $this->view('doctors/delete');
    }
}
