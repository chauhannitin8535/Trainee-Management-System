// server.js — NTPC Trainee Management System - Main Server
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// =============================================
// MIDDLEWARE
// =============================================
app.use(cors({
    origin: 'http://localhost:3000', // Frontend URL
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(session({
    secret: process.env.SESSION_SECRET || 'ntpc_secret_key_2024',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true in production with HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// =============================================
// ROUTES
// =============================================
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/trainees', require('./routes/traineeRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'NTPC Trainee System API is running ✅', timestamp: new Date() });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error:', err.message);
    res.status(err.status || 500).json({ success: false, message: err.message || 'Internal server error.' });
});

// =============================================
// START SERVER
// =============================================
app.listen(PORT, () => {
    console.log('');
    console.log('⚡ ====================================== ⚡');
    console.log('   NTPC Trainee Management System');
    console.log(`   Backend running at: http://localhost:${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/api/health`);
    console.log('⚡ ====================================== ⚡');
    console.log('');
});