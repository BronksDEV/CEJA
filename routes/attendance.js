const express = require('express');
const router = express.Router();
const { registerAttendance } = require('../controllers/attendanceController');

// Configura a rota para registrar a falta
router.post('/register', registerAttendance);

module.exports = router;
