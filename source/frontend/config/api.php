<?php
return [
    'base_url' => getenv('API_BASE_URL') ?: 'http://localhost:3000',
    'timeout' => 30,
    'headers' => [
        'Content-Type' => 'application/json',
        'Accept' => 'application/json'
    ],
    'endpoints' => [
        'login' => '/api/user/login',
        'register' => '/api/user/register',
        'logout' => '/api/user/logout',
        'users' => '/api/users',
        'posts' => '/posts',
        'doctors' => '/doctors',
        'create_doctor' => '/doctors/Create',
        'update_doctor' => '/doctors/update',
        'update_doctor_availability' => '/doctors/updateAvailability',
        'appointment_get_id' => 'Appointments'
    ]
];
