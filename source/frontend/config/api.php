<?php
return [
    'base_url' => 'https://jsonplaceholder.typicode.com',
    'timeout' => 30,
    'headers' => [
        'Content-Type' => 'application/json',
        'Accept' => 'application/json'
    ],
    'endpoints' => [
        'users' => '/users',
        'posts' => '/posts',
        'doctors' => '/doctors',
        'create_doctor' => '/doctors/Create',
        'update_doctor' => '/doctors/update',
        'update_doctor_availability' => '/doctors/updateAvailability',
        'appointment_get_id' => 'Appointments'
    ]
];
