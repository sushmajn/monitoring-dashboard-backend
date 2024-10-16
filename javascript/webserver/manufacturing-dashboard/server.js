import express from 'express';
import cors from 'cors'; 
import employeeController from './app/controllers/employeeController.js'; 
import { authenticateUser, authorizeRoles } from './app/middlewares/auth.js';
import { registerValidation, loginValidation } from './app/validations/employeeValidation.js';
import { addInspectionRecord, getAllInspectionRecords } from './app/controllers/qualityController.js';

import configureDB from './config/db.js'; 
import {
  getMachineStatus,
  getProductionData,
  getEnvironmentalFactors,
  postMachineData,
  postProductionData,
  postEnvironmentData
} from './app/controllers/monitoringController.js'
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3010;

app.use(express.json());
app.use(cors()); 

configureDB();

// Routes
app.post('/register', registerValidation, employeeController.register); 
app.post('/login', loginValidation, employeeController.login);

app.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logout successful' });
});
// Admin-only route
app.post('/create-employee', authenticateUser, authorizeRoles('admin'), employeeController.createProfile);
app.put('/employee/:id', authenticateUser, authorizeRoles('admin'), employeeController.updateProfile);
app.delete('/employee/:id', authenticateUser, authorizeRoles('admin'), employeeController.deleteProfile);
app.get('/employees', authenticateUser, authorizeRoles('admin'), employeeController.getAllEmployees);
app.get('/employee/:id', authenticateUser, authorizeRoles('admin'), employeeController.getEmployeeById);

app.get('/machines', authenticateUser, authorizeRoles('employee', 'admin'), getMachineStatus);
app.get('/production', authenticateUser, authorizeRoles('employee', 'admin'), getProductionData);
app.get('/environment', authenticateUser, authorizeRoles('employee', 'admin'), getEnvironmentalFactors);
app.post('/machines', authenticateUser, authorizeRoles('employee', 'admin'), postMachineData);
app.post('/production', authenticateUser, authorizeRoles('employee', 'admin'), postProductionData);
app.post('/environment', authenticateUser, authorizeRoles('employee', 'admin'), postEnvironmentData);

app.post('/quality-control', authenticateUser, authorizeRoles('employee', 'admin'), addInspectionRecord);
app.get('/quality-control', authenticateUser, authorizeRoles('operator','employee', 'admin'), getAllInspectionRecords);



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

