import { Schema, model } from 'mongoose';

const employeeSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String, // Password can be null until the user registers
  },
  role: {
    type: String,
    enum: ['admin', 'employee', 'operator'],
    required: true,
  },
  isRegistered: {
    type: Boolean,
    default: false, // Indicates if the user has completed registration
  },
}, { timestamps: true });

const Employee = model('Employee', employeeSchema);
export default Employee;
