const express = require('express');
const router = express.Router();
const { getAttendanceByDate, getAttendanceByTrainee, bulkMarkAttendance, getTodayCount } = require('../controllers/attendanceController');

router.get('/today', getTodayCount);
router.get('/date/:date', getAttendanceByDate);
router.get('/trainee/:id', getAttendanceByTrainee);
router.post('/bulk', bulkMarkAttendance);

module.exports = router;