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
        'doctor_get_userId' => '/api/doctor/GetDoctorByUserId',
        'update_doctor' => '/doctors/update',
        'update_doctor_availability' => '/doctors/updateAvailability',
        'appointment_get_id' => 'Appointments',
        'patient' => '/api/patient',
        'medicine' => '/api/medicine',
        'medicine_get_all' => '/api/medicine/GetAllMedicines',
        'medicine_get_by_id' => '/api/medicine/GetMedicineById',
        'medicine_create' => '/api/medicine/CreateMedicine',
        'medicine_update' => '/api/medicine/UpdateMedicine',
        'medicine_delete' => '/api/medicine/DeleteMedicine',
        'medicine_restore' => '/api/medicine/RestoreMedicine',
        'prescription' => '/api/prescription',
        'prescription_get_all' => '/api/prescription/GetAllPrescriptions',
        'prescription_get_by_id' => '/api/prescription/GetPrescriptionById',
        'prescription_create' => '/api/prescription/CreatePrescription',
        'prescription_update' => '/api/prescription/UpdatePrescription',
        'prescription_delete' => '/api/prescription/DeletePrescription',
        'prescription_restore' => '/api/prescription/RestorePrescription',
    ]
];
