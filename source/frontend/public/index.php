<?php
// Handle routing for PHP built-in development server
if (php_sapi_name() === 'cli-server') {
    $uri = $_SERVER['REQUEST_URI'];
    $path = parse_url($uri, PHP_URL_PATH);

    // If it's a real file, serve it normally
    if ($path !== '/' && file_exists(__DIR__ . $path)) {
        return false;
    }

    // Extract the URL path for routing
    $path = ltrim($path, '/');
    if (!empty($path)) {
        $_GET['url'] = $path;
    }
}
// For Apache, the .htaccess RewriteRule already sets $_GET['url']

require_once '../app/core/App.php';
require_once '../app/core/Controller.php';

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

$app = new App();
