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
        'albums' => '/albums'
    ]
];