const express = require('express');
const router = express.Router();
const {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes below require the user to be logged in (protect)
router.use(protect);

router.route('/')
  .get(getEmployees) // any logged-in user can view the list (we can restrict later if needed)
  .post(authorize('admin', 'hr'), createEmployee); // only Admin/HR can create

router.route('/:id')
  .get(getEmployeeById)
  .put(authorize('admin', 'hr'), updateEmployee)
  .delete(authorize('admin'), deleteEmployee); // only Admin can delete

module.exports = router;