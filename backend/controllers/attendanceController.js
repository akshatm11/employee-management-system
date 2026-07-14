const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

// Helper: get today's date with time reset to midnight (so we can match "same day" records)
const getTodayDateOnly = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

// @desc    Check in for today
// @route   POST /api/attendance/checkin
// @access  Private
const checkIn = async (req, res) => {
  try {
    const { employeeId } = req.body; // the Employee document's _id (not the login user id)
    const today = getTodayDateOnly();

    // Check if already checked in today
    let attendance = await Attendance.findOne({ employee: employeeId, date: today });

    if (attendance && attendance.checkIn) {
      return res.status(400).json({ success: false, message: 'Already checked in today' });
    }

    if (!attendance) {
      attendance = await Attendance.create({
        employee: employeeId,
        date: today,
        checkIn: new Date(),
        status: 'present',
      });
    } else {
      attendance.checkIn = new Date();
      await attendance.save();
    }

    res.status(200).json({ success: true, message: 'Checked in successfully', data: attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Check out for today
// @route   POST /api/attendance/checkout
// @access  Private
const checkOut = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const today = getTodayDateOnly();

    const attendance = await Attendance.findOne({ employee: employeeId, date: today });

    if (!attendance || !attendance.checkIn) {
      return res.status(400).json({ success: false, message: 'You must check in before checking out' });
    }

    if (attendance.checkOut) {
      return res.status(400).json({ success: false, message: 'Already checked out today' });
    }

    attendance.checkOut = new Date();

    // Calculate working hours: (checkOut - checkIn) in milliseconds, converted to hours
    const diffMs = attendance.checkOut - attendance.checkIn;
    attendance.workingHours = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100; // rounded to 2 decimals

    await attendance.save();

    res.status(200).json({ success: true, message: 'Checked out successfully', data: attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get attendance records (with optional filters)
// @route   GET /api/attendance
// @access  Private
const getAttendance = async (req, res) => {
  try {
    const { employeeId, startDate, endDate } = req.query;
    const query = {};

    if (employeeId) query.employee = employeeId;

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const records = await Attendance.find(query)
      .populate('employee', 'fullName employeeId')
      .sort({ date: -1 });

    res.status(200).json({ success: true, count: records.length, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get today's attendance status for a specific employee
// @route   GET /api/attendance/today/:employeeId
// @access  Private
const getTodayStatus = async (req, res) => {
  try {
    const today = getTodayDateOnly();
    const attendance = await Attendance.findOne({ employee: req.params.employeeId, date: today });

    res.status(200).json({ success: true, data: attendance || null });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { checkIn, checkOut, getAttendance, getTodayStatus };