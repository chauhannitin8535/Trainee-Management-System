-- =============================================
-- NTPC Trainee Management System - Database
-- Run this file in MySQL Workbench or CLI:
--   mysql -u root -p < database.sql
-- =============================================

CREATE DATABASE IF NOT EXISTS ntpc_trainee_db;
USE ntpc_trainee_db;

-- ---- ADMIN USERS TABLE ----
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'officer', 'executive') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---- TRAINEES TABLE ----
CREATE TABLE IF NOT EXISTS trainees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    college VARCHAR(200) NOT NULL,
    course ENUM('B.Tech', 'M.Tech', 'BCA', 'MCA', 'Other') NOT NULL,
    branch VARCHAR(100),
    year_semester VARCHAR(50),
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    training_officer_name VARCHAR(100),
    training_officer_emp_id VARCHAR(50),
    training_executive_name VARCHAR(100),
    training_executive_emp_id VARCHAR(50),
    certificate_issued ENUM('yes', 'no') DEFAULT 'no',
    work_complete ENUM('yes', 'no') DEFAULT 'no',
    report_file VARCHAR(255),
    training_letter_file VARCHAR(255),
    certificate_file VARCHAR(255),
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- ---- PROJECTS TABLE ----
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trainee_id INT NOT NULL,
    project_number INT DEFAULT 1,
    project_name VARCHAR(200) NOT NULL,
    description TEXT,
    file_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trainee_id) REFERENCES trainees(id) ON DELETE CASCADE
);

-- ---- ATTENDANCE TABLE ----
CREATE TABLE IF NOT EXISTS attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trainee_id INT NOT NULL,
    date DATE NOT NULL,
    status ENUM('present', 'absent') NOT NULL,
    marked_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_attendance (trainee_id, date),
    FOREIGN KEY (trainee_id) REFERENCES trainees(id) ON DELETE CASCADE,
    FOREIGN KEY (marked_by) REFERENCES admin_users(id)
);

-- ---- FEEDBACK TABLE ----
CREATE TABLE IF NOT EXISTS feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trainee_id INT NOT NULL,
    officer_rating INT CHECK (officer_rating BETWEEN 1 AND 5),
    officer_remarks TEXT,
    executive_rating INT CHECK (executive_rating BETWEEN 1 AND 5),
    executive_remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (trainee_id) REFERENCES trainees(id) ON DELETE CASCADE
);

-- =============================================
-- DEFAULT ADMIN USER
-- Password: admin123 (bcrypt hashed)
-- Change this after first login!
-- =============================================
INSERT INTO admin_users (employee_id, name, email, password, role)
VALUES (
    'NTPC-IT-ADMIN',
    'IT Admin',
    'admin@ntpc.com',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'admin'
) ON DUPLICATE KEY UPDATE employee_id = employee_id;

-- =============================================
-- Sample test data (optional - comment out if not needed)
-- =============================================
INSERT INTO trainees (name, email, mobile, college, course, branch, year_semester, from_date, to_date, training_officer_name, training_executive_name, created_by)
VALUES (
    'Nitin Chauhan',
    'rahul@iit.ac.in',
    '9876543210',
    'IIT Delhi',
    'B.Tech',
    'Computer Science',
    '3rd Year / 6th Sem',
    '2025-01-01',
    '2025-03-31',
    'Mr. Suresh Kumar',
    'Ms. Priya Verma',
    1
) ON DUPLICATE KEY UPDATE name = name;