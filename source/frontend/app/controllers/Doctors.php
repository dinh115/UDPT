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

        if ($result['success']) {
            $data = [
                'title' => 'Doctor Details',
                'doctor' => $result['data']
            ];
            $this->view('doctors/show', $data);
        } else {

            $this->renderError(
                'Doctor Not Found',
                $result['error']
            );
            return;
        }
    }

    public function create()
    {
        $this->view('doctors/create');
    }


    public function update()
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
            $this->renderError('404', 'Page Not Found', 'Sorry the page you are looking for does not exist');
            return;
        }
        $doctorModel = $this->model('Doctor');

        // Đọc JSON từ body request (fetch gửi từ JS)
        $data = json_decode(file_get_contents('php://input'), true);

        if (!$data) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid JSON']);
            return;
        }

        // Debug view request
        // header('Content-Type: application/json');
        // echo json_encode($data, JSON_PRETTY_PRINT);
        // exit;

        // Gọi API thông qua ApiService
        $response = $this->$doctorModel->createDoctorProfile($data);

        // Trả response JSON lại cho frontend
        header('Content-Type: application/json');
        echo json_encode($response);
    }

    public function api()
    {
        $doctorModel = $this->model('Doctor');
        $result = $doctorModel->getAllDoctor();
        $this->jsonResponse($result);
    }
}
