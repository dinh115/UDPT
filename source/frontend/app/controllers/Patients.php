<?php
class Patients extends Controller
{
    private $patientModel;
    private $userModel;

    public function __construct()
    {
        // Check if user is logged in
        $userId = $_SESSION['user_session']['user']['id'] ?? null;
        if (!$userId) {
            $this->redirect('/auth/login');
        }
        $this->patientModel = $this->model('Patient');
        $this->userModel = $this->model('User');
    }

        public function index()
        {
            try {
                // Get user info
                $userId = $_SESSION['user_session']['user']['id'];
                $userInfo = $_SESSION['user_session']['user'];
                // Get patient visit history
                $visitHistory = $this->patientModel->getVisitHistory($userId)['data']['visits'];
                
                foreach ($visitHistory as &$visit) {
                    if (isset($visit['visitDate']['seconds'])) {
                        $visit['visit_date'] = (new DateTime())->setTimestamp($visit['visitDate']['seconds'])->format('Y-m-d H:i:s');
                    } else {
                        $visit['visit_date'] = null;
                    }
                }


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

    // public function info()
    // {
    //     try {
    //         $userId = $_SESSION['user_id'];
    //         $userInfo = $this->userModel->getUserById($userId);

    //         $data = [
    //             'title' => 'Thông Tin Cá Nhân',
    //             'userInfo' => $userInfo
    //         ];

    //         $this->view('patient/info', $data);
    //     } catch (Exception $e) {
    //         $this->renderError('Lỗi', 'Không thể tải thông tin cá nhân', $e->getMessage());
    //     }
    // }
    public function history()
    {
        try {
            $userId = $_SESSION['user_session']['user']['id'];
            $visitHistoryRaw = $this->patientModel->getVisitHistory($userId)['data']['visits'];

            $visitHistory = [];
            foreach ($visitHistoryRaw as $visit) {
                $visit['diagnosis_description'] = $this->patientModel->getDiagnosisDescription($visit['diagnosis'] ?? []);
                $visit['vital_signs_formatted'] = $this->patientModel->formatVitalSigns($visit['vital_signs'] ?? []);
                $visitHistory[] = $visit;
            }

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
            $visitDetail = $this->patientModel->getVisitDetail($visitId)['data']['visit'];

            if (!$visitDetail) {
                $this->renderError('Lỗi', 'Không tìm thấy thông tin lượt khám');
                return;
            }


            // Check if this visit belongs to current user
            if ($visitDetail['patient'] !== $_SESSION['user_session']['user']['id']) {
                $this->renderError('Lỗi', 'Không có quyền truy cập thông tin này');
                return;
            }
            if (isset($visitDetail['visitDate']['seconds'])) {
                $visitDetail['visit_date'] = (new DateTime())->setTimestamp($visitDetail['visitDate']['seconds'])->format('Y-m-d H:i:s');
            } else {
                $visitDetail['visit_date'] = null;
            }

            
            $vitalSigns = $this->patientModel->formatVitalSigns($visitDetail['vital_signs']);
            $data = [
                'title' => 'Chi Tiết Lượt Khám',
                'visitDetail' => $visitDetail,
                'vitalSigns' => $vitalSigns
            ];

            $this->view('patient/detail', $data);
        } catch (Exception $e) {
            $this->renderError('Lỗi', 'Không thể tải chi tiết lượt khám', $e->getMessage());
        }
    }

    public function createPatientVisit() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $patient = $_POST['patient'] ?? null;
            $doctor = $_POST['doctor'] ?? null;
            $department = $_POST['department'] ?? null;
            $reasonForVisit = $_POST['reason_for_visit'] ?? null;
            $visitDate = $_POST['visitDate'] ?? null;
            $prescription = $_POST['prescription'] ?? null;
            $notes = $_POST['notes'] ?? null;
            if (!$patient || !$doctor || !$visitDate) {
                $this->jsonResponse([
                    'success' => false,
                    'error' => 'Thiếu thông tin bắt buộc'
                ]);
                return;
            }
            
            $timestamp = strtotime($visitDate); // Trả về số giây
            if (!$timestamp) {
                $this->jsonResponse([
                    'success' => false,
                    'error' => 'Ngày khám không hợp lệ'
                ]);
                return;
            }
            $vitalSigns = array_filter($_POST['vital_signs'] ?? [], fn($v) => $v !== '');
            $vitalSigns = !empty($vitalSigns) ? $vitalSigns : null;

            $symptoms = array_values(array_filter($_POST['symptoms'] ?? [], fn($v) => $v !== ''));
            $allergies = array_values(array_filter($_POST['allergies'] ?? [], fn($v) => $v !== ''));

            $diagnosis = array_values(array_filter($_POST['diagnosis'] ?? [], function ($d) {
                return !empty($d['code']) || !empty($d['description']);
            }));

            $tests = array_values(array_filter($_POST['tests'] ?? [], function ($t) {
                return !empty($t['name']) || !empty($t['result']) || !empty($t['date']) || !empty($t['file_url']);
            }));

            $visitPayload = [
                'visit' => [
                    'patient' => $patient,
                    'doctor' => $doctor,
                    'visitDate' => [
                        'seconds' => (int)$timestamp,
                        'nanos' => 0
                    ],
                    'department' => $department,
                    'reason_for_visit' => $reasonForVisit,
                    'vital_signs' => $vitalSigns,
                    'symptoms' => $symptoms,
                    'allergies' => $allergies,
                    'diagnosis' => $diagnosis,
                    'tests' => $tests,
                    'prescription' => $prescription,
                    'notes' => $notes
                ]
            ];

            $result = $this->model('Patient')->createVisit($visitPayload);
            $this->jsonResponse($result);
        } else {

            $patientId = $_GET['patientId'] ?? null;
            $doctorId = $_GET['doctorId'] ?? null;
            $department = null;

            if ($doctorId) {
                $userModel = $this->model('Doctor');
                $doctor = $userModel->getDoctorByUserId($doctorId)['data']['doctor'];


                if ($doctor && isset($doctor['specialization'])) {
                    $department = $doctor['specialization'];
                }
            }

            $data = [
                'title' => 'Tạo phiếu khám bệnh',
                'patientId' => $patientId,
                'doctorId' => $doctorId,
                'department' => $department
            ];


            
            $this->view('patient/create', $data);
        }
    }
}