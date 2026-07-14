const express = require('express');
const router = express.Router();
const {
  createDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment,
} = require('../controllers/departmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getDepartments)
  .post(authorize('admin', 'hr'), createDepartment);

router.route('/:id')
  .put(authorize('admin', 'hr'), updateDepartment)
  .delete(authorize('admin'), deleteDepartment);

module.exports = router;