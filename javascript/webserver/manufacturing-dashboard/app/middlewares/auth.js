// import jwt from 'jsonwebtoken';

// export const authenticateUser = (req, res, next) => {
//   const token = req.headers['authorization'];
//   if (!token) {
//     return res.status(401).json({ error: 'Token is required' });
//   }

//   try {
//     const tokenData = jwt.verify(token, process.env.JWT_SECRET);
//     req.userId = tokenData.employeeId;
//     req.role = tokenData.role;
//     next();
//   } catch (err) {
//     return res.status(401).json({ error: 'Invalid token' });
//   }
// };

// export const authorizeRoles = (...allowedRoles) => {
//   return (req, res, next) => {
//     if (!allowedRoles.includes(req.role)) {
//       return res.status(403).json({ error: 'Access denied' });
//     }
//     next();
//   };
// };

import jwt from 'jsonwebtoken';
import Employee from '../models/EmployeeModel.js'; 

// Middleware to check if an admin exists
export const checkAdminExists = async (req, res, next) => {
  try {
    const adminExists = await Employee.findOne({ role: 'admin' });
    if (!adminExists) {
      // No admin exists, skip authentication
      return next();
    }
    // Admin exists, require authentication
    return authenticateUser(req, res, next);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Middleware to authenticate user
export const authenticateUser = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'Token is required' });
  }

  try {
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = tokenData.employeeId;
    req.role = tokenData.role;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Middleware to authorize roles
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
};
