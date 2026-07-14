const Leave = require('../models/Leave');

// @desc    Apply for leave
// @route   POST /api/leaves
// @access  Private
const applyLeave = async (req, res) => {
  try {
    const { employeeId, leaveType, startDate, endDate, reason } = req.body;

    const leave = await Leave.create({
      employee: employeeId,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    res.status(201).json({ success: true, message: 'Leave applied successfully', data: leave });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get leave requests (optionally filtered by employee or status)
// @route   GET /api/leaves
// @access  Private
const getLeaves = async (req, res) => {
  try {
    const { employeeId, status } = req.query;
    const query = {};

    if (employeeId) query.employee = employeeId;
    if (status) query.status = status;

    const leaves = await Leave.find(query)
      .populate('employee', 'fullName employeeId')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: leaves.length, data: leaves });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Approve or reject a leave request
// @route   PUT /api/leaves/:id/status
// @access  Private (Admin, HR)
const updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body; // expected: 'approved' or 'rejected'

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status, reviewedBy: req.user._id },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave request not found' });
    }

    res.status(200).json({ success: true, message: `Leave ${status} successfully`, data: leave });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Delete/cancel a leave request
// @route   DELETE /api/leaves/:id
// @access  Private
const deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndDelete(req.params.id);

    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave request not found' });
    }

    res.status(200).json({ success: true, message: 'Leave request deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { applyLeave, getLeaves, updateLeaveStatus, deleteLeave };