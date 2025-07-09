<?php
return [
    'base_url' => getenv('API_BASE_URL') ?: 'http://gateway:3000',
    'timeout' => 30,
    'headers' => [
        'Content-Type' => 'application/json',
        'Accept' => 'application/json'
    ],
    'endpoints' => [
        'login' => '/api/user/login',
        'register' => '/api/user/register',
        'logout' => '/api/user/logout',
        'users' => '/api/user',
        'posts' => '/posts',
        'doctors' => '/api/doctors/',
        'doctor_get_id' => '/api/doctor/GetDoctorById',
        'update_doctor' => '/doctors/update',
        'update_doctor_availability' => '/doctors/updateAvailability',
        'appointment_get_id' => 'Appointments'
    ]
];
