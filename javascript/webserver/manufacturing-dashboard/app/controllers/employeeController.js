import Employee from '../models/EmployeeModel.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

// Middleware to check if an admin exists
const checkAdminExists = async (req, res, next) => {
  try {
    const adminExists = await Employee.findOne({ role: 'admin' });
    if (!adminExists) {
      return next();
    }
    // Admin exists, require authentication
    return authenticateUser(req, res, next);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const employeeController = {};

// Admin creates an employee/operator profile without setting a password
employeeController.createProfile = async (req, res) => {

  try {
    const { email, role } = req.body;
    const validRoles = ['admin', 'employee', 'operator'];

    if (!validRoles.map(r => r.toLowerCase()).includes(role.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid role. Must be admin, employee, or operator' });
    }

    // Check if the user already exists
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // If no other employees exist, assign the first one as admin
    const employeeCount = await Employee.countDocuments();
    const assignedRole = employeeCount === 0 ? 'admin' : role.toLowerCase();

    const employee = new Employee({
      email,
      role: assignedRole,
      password: null,
      isRegistered: false
    });

    await employee.save();
    res.status(201).json({
      message: `Profile created successfully. The ${assignedRole} needs to complete registration.`,
      employee
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Employee/Operator completes registration by setting a password
employeeController.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    const employee = await Employee.findOne({ email });

    // Ensure the user exists and has not already completed registration
    if (!employee || employee.isRegistered) {
      return res.status(400).json({ error: 'Invalid or profile not created' });
    }

    // Hash the password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Update the employee's password and mark as registered
    employee.password = hashedPassword;
    employee.isRegistered = true;

    await employee.save();
    res.status(201).json({ message: 'Registration completed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Login for employee/operator
employeeController.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const employee = await Employee.findOne({ email });

    // Check if the employee exists and has completed registration
    if (!employee || !employee.isRegistered) {
      return res.status(400).json({ error: 'User not registered or invalid credentials' });
    }

    const isMatch = await bcryptjs.compare(password, employee.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { employeeId: employee._id, role: employee.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Admin updates an employee profile
employeeController.updateProfile = async (req, res) => {
  const { id } = req.params;
  const { email, role } = req.body;

  try {
    const validRoles = ['admin', 'employee', 'operator'];

    if (role && !validRoles.map(r => r.toLowerCase()).includes(role.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid role. Must be admin, employee, or operator' });
    }

    const updatedData = {};

    if (email) updatedData.email = email;
    if (role) updatedData.role = role.toLowerCase();

    const updatedEmployee = await Employee.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json({
      message: 'Employee profile updated successfully',
      updatedEmployee
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Admin deletes an employee profile
employeeController.deleteProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await Employee.findByIdAndDelete(id);

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee profile deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fetch all employees
employeeController.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// Fetch an employee by ID
employeeController.getEmployeeById = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.status(200).json(employee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export { checkAdminExists };
export default employeeController;
