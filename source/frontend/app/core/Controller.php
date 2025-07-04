<?php
class Controller
{
    public function model($model)
    {
        if (file_exists('../app/models/' . $model . '.php')) {
            require_once '../app/models/' . $model . '.php';
            return new $model();
        }
        throw new Exception("Model {$model} not found");
    }

    public function view($view, $data = [])
    {
        if (file_exists('../app/views/' . $view . '.php')) {
            require_once '../app/views/' . $view . '.php';
        } else {
            throw new Exception("View {$view} not found");
        }
    }

    public function renderError($title = 'Error', $error = 'Error', $message = 'An error occurred.')
    {
        $data = [
            'title' => $title,
            'error' => $error,
            'message' => $message
        ];

        require_once '../app/views/template/error.php'; // generic error view
        exit;
    }
    protected function jsonResponse($data, $statusCode = 200)
    {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }

    protected function redirect($url)
    {
        header('Location: ' . $url);
        exit;
    }
}
