const Department = require('../models/Department');
const Employee = require('../models/Employee');

// @desc    Create a department
// @route   POST /api/departments
// @access  Private (Admin, HR)
const createDepartment = async (req, res) => {
  try {
    const department = await Department.create(req.body);
    res.status(201).json({ success: true, message: 'Department created successfully', data: department });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get all departments (with employee count for each)
// @route   GET /api/departments
// @access  Private
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate('head', 'fullName').sort({ createdAt: -1 });

    // For each department, count how many employees belong to it
    const departmentsWithCount = await Promise.all(
      departments.map(async (dept) => {
        const employeeCount = await Employee.countDocuments({ department: dept._id });
        return { ...dept.toObject(), employeeCount };
      })
    );

    res.status(200).json({ success: true, count: departmentsWithCount.length, data: departmentsWithCount });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update a department
// @route   PUT /api/departments/:id
// @access  Private (Admin, HR)
const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    res.status(200).json({ success: true, message: 'Department updated successfully', data: department });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Delete a department
// @route   DELETE /api/departments/:id
// @access  Private (Admin only)
const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);

    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    res.status(200).json({ success: true, message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { createDepartment, getDepartments, updateDepartment, deleteDepartment };