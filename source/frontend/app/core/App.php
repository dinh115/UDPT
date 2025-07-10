<?php
class App
{
    protected $controller = 'Home';
    protected $method = 'index';
    protected $params = [];

    public function __construct()
    {
        $url = $this->parseUrl();
        // echo $url[0] . "<br>";
        // DEBUG: See what URL is being parsed
        //echo "Parsed URL: ";
        //var_dump($url);

        // Check for controller
        if ($url && file_exists('../app/controllers/' . ucwords($url[0]) . '.php')) {
            $this->controller = ucwords($url[0]);
            unset($url[0]);
        }

        // echo "Controller: " . $this->controller . "<br>";

        require_once '../app/controllers/' . $this->controller . '.php';
        $this->controller = new $this->controller;

        // Check for method
        // echo $url[1] . "<br>";
        if (isset($url[1])) {
            if (method_exists($this->controller, $url[1])) {
                $this->method = $url[1];
                unset($url[1]);
            }
        }

        $this->params = $url ? array_values($url) : [];

        call_user_func_array([$this->controller, $this->method], $this->params);
    }

    public function parseUrl()
    {
        if (isset($_GET['url'])) {
            return explode('/', filter_var(rtrim($_GET['url'], '/'), FILTER_SANITIZE_URL));
        }
        return [];
    }
}
