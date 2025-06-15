<?php
class Home extends Controller {
    public function index() {
        $userModel = $this->model('User');
        $postModel = $this->model('Post');
        
        $usersResult = $userModel->getAllUsers(1, 5);
        $postsResult = $postModel->getAllPosts(['_limit' => 5]);
        
        $data = [
            'title' => 'Welcome to MVC API Frontend',
            'users' => $usersResult['success'] ? $usersResult['data'] : [],
            'posts' => $postsResult['success'] ? $postsResult['data'] : [],
            'users_error' => !$usersResult['success'] ? $usersResult['error'] : null,
            'posts_error' => !$postsResult['success'] ? $postsResult['error'] : null
        ];
        
        $this->view('home/index', $data);
    }
    
    public function about() {
        $data = [
            'title' => 'About Our MVC App'
        ];
        
        $this->view('home/about', $data);
    }
}