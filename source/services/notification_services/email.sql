CREATE TABLE email_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255),
    type ENUM('reminder', 'prescription'),
    status ENUM('success', 'failed'),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
