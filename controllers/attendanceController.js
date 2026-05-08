const db = require('../config/db');

const getAttendanceByDate = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM attendance WHERE date = ?', [req.params.date]);
        res.json({ success: true, attendance: rows });
    } catch(err) {
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

const getAttendanceByTrainee = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM attendance WHERE trainee_id = ? ORDER BY date DESC', [req.params.id]);
        res.json({ success: true, attendance: rows });
    } catch(err) {
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

const bulkMarkAttendance = async (req, res) => {
    try {
        const { records } = req.body;
        for (const r of records) {
            // Fix timezone - use date as-is from frontend
            const dateStr = r.date;
            await db.execute(
                'INSERT INTO attendance (trainee_id, date, status) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE status = ?',
                [r.trainee_id, dateStr, r.status, r.status]
            );
        }
        res.json({ success: true, message: 'Attendance saved!' });
    } catch(err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

const getTodayCount = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const [rows] = await db.execute('SELECT COUNT(*) as count FROM attendance WHERE date = ? AND status = "Present"', [today]);
        res.json({ success: true, count: rows[0].count });
    } catch(err) {
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

module.exports = { getAttendanceByDate, getAttendanceByTrainee, bulkMarkAttendance, getTodayCount };