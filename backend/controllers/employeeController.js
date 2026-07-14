const Employee = require('../models/Employee');

// Generates a simple, sequential Employee ID like EMP001, EMP002, etc.
const generateEmployeeId = async () => {
  const count = await Employee.countDocuments();
  const nextNumber = count + 1;
  return `EMP${String(nextNumber).padStart(3, '0')}`;
};

// @desc    Create a new employee
// @route   POST /api/employees
// @access  Private (Admin, HR)
const createEmployee = async (req, res) => {
  try {
    const employeeId = await generateEmployeeId();

    const employee = await Employee.create({
      ...req.body,
      employeeId,
    });

    res.status(201).json({ success: true, message: 'Employee created successfully', data: employee });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get all employees (with search, filter, pagination)
// @route   GET /api/employees
// @access  Private (Admin, HR)
const getEmployees = async (req, res) => {
  try {
    const { search, department, status, page = 1, limit = 10 } = req.query;

    // Build a dynamic query object based on filters provided
    const query = {};

    if (search) {
      // Case-insensitive search across name or email
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (department) query.department = department;
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const employees = await Employee.find(query)
      .populate('department', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Employee.countDocuments(query);

    res.status(200).json({
      success: true,
      count: employees.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      data: employees,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get a single employee by ID
// @route   GET /api/employees/:id
// @access  Private
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate('department', 'name');

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update an employee
// @route   PUT /api/employees/:id
// @access  Private (Admin, HR)
const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // return the updated document
      runValidators: true, // enforce schema rules on update too
    });

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.status(200).json({ success: true, message: 'Employee updated successfully', data: employee });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Delete an employee
// @route   DELETE /api/employees/:id
// @access  Private (Admin only)
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.status(200).json({ success: true, message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};