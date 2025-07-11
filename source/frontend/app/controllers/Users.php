<?php
class Users extends Controller {
    
    public function index() {
        $userModel = $this->model('User');
        
        $page = $_GET['page'] ?? 1;
        $limit = $_GET['limit'] ?? 10;
        
        $result = $userModel->getAllUsers($page, $limit);
        
        if ($result['success']) {
            $data = [
                'title' => 'Users List',
                'users' => $result['data']['users'],
                'current_page' => $page
            ];
        } else {
            $data = [
                'title' => 'Users List',
                'users' => [],
                'error' => $result['error']
            ];
        }
        
        $this->view('users/index', $data);
    }
    
    public function show($id = null) {
        if (!$id) {
            $this->redirect('/users');
            return;
        }
        
        $userModel = $this->model('User');
        $result = $userModel->getUserById($id);
        
        if ($result['success']) {
            $data = [
                'title' => 'User Details',
                'user' => $result['data']['user']
            ];
            $this->view('users/show', $data);
        } else {
            $data = [
                'title' => 'User Not Found',
                'error' => $result['error']
            ];
            $this->view('users/error', $data);
        }
    }
    
    public function api() {
        $userModel = $this->model('User');
        $result = $userModel->getAllUsers();
        $this->jsonResponse($result);
    }
}