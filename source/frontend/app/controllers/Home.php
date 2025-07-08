<?php
class Home extends Controller
{
    public function index()
    {
        $this->view('home/index');
    }

    public function about()
    {
        $data = [
            'title' => 'About Our MVC App'
        ];

        $this->view('home/about', $data);
    }
}
