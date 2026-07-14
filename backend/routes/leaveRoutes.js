const express = require('express');
const router = express.Router();
const {
  applyLeave,
  getLeaves,
  updateLeaveStatus,
  deleteLeave,
} = require('../controllers/leaveController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getLeaves)
  .post(applyLeave);

router.put('/:id/status', authorize('admin', 'hr'), updateLeaveStatus);
router.delete('/:id', deleteLeave);

module.exports = router;