import { Machine } from '../models/MachineModel.js';
import { Production } from '../models/ProductionModel.js';
import { Environment } from '../models/EnvironmentModel.js';

// Get methods 
// get machine data
export const getMachineStatus = async (req, res) => {
  try {
    const machines = await Machine.find({});
    res.status(200).json(machines);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch machine status' });
  }
};

// get production data
export const getProductionData = async (req, res) => {
  try {
    const productionData = await Production.find({});
    res.status(200).json(productionData);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch production data' });
  }
};

// get environment data
export const getEnvironmentalFactors = async (req, res) => {
  try {
    const environmentData = await Environment.find({});
    res.status(200).json(environmentData);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch environmental data' });
  }
};

// Post methods 
// Post machine data
export const postMachineData = async (req, res) => {
  try {
    const { machineId, status, uptime, downtime } = req.body;
    const newMachine = new Machine({ machineId, status, uptime, downtime });
    await newMachine.save();
    res.status(201).json({ message: 'Machine data added successfully', newMachine });
  } catch (error) {
    res.status(500).json({ error: 'Unable to add machine data' });
  }
};

// Post production data
export const postProductionData = async (req, res) => {
  try {
    const { productId, unitsProduced, productionRate, timeStamp } = req.body;
    const newProduction = new Production({ productId, unitsProduced, productionRate, timeStamp });
    await newProduction.save();
    res.status(201).json({ message: 'Production data added successfully', newProduction });
  } catch (error) {
    res.status(500).json({ error: 'Unable to add production data' });
  }
};

// Post environment data
export const postEnvironmentData = async (req, res) => {
  try {
    const { temperature, humidity, timestamp } = req.body;
    const newEnvironment = new Environment({ temperature, humidity, timestamp });
    await newEnvironment.save();
    res.status(201).json({ message: 'Environmental data added successfully', newEnvironment });
  } catch (error) {
    res.status(500).json({ error: 'Unable to add environmental data' });
  }
};
