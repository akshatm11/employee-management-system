const express = require('express');
const router = express.Router();
const {
  checkIn,
  checkOut,
  getAttendance,
  getTodayStatus,
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.post('/checkin', checkIn);
router.post('/checkout', checkOut);
router.get('/', getAttendance);
router.get('/today/:employeeId', getTodayStatus);

module.exports = router;