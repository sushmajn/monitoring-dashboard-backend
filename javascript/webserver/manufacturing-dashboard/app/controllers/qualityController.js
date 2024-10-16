import { QualityControl } from '../models/QualityControlModel.js';

// Add a new inspection record
export const addInspectionRecord = async (req, res) => {
  try {
    const { productId, defectsFound, status, correctiveAction } = req.body;
    const inspectorId = req.userId; // The logged-in employee's ID

    // Check if a record already exists for the same productId and inspectorId
    const existingRecord = await QualityControl.findOne({ productId, inspectorId });
    
    if (existingRecord) {
      return res.status(400).json({ error: 'Inspection record already exists for this product by the same inspector' });
    }

    const newRecord = new QualityControl({
      productId,
      inspectorId,
      defectsFound,
      correctiveAction,
      status,
    });

    await newRecord.save();
    res.status(201).json({ message: 'Quality control record added', newRecord });
  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: 'Unable to add inspection record', details: error.message });
  }
};

// Get all quality control records
export const getAllInspectionRecords = async (req, res) => {
  try {
    const records = await QualityControl.find({}).populate('inspectorId', 'email role');
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch inspection records' });
  }
};
