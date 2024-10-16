import mongoose from 'mongoose';

const configureDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
    });
    console.log('Connected to the database');
  } catch (err) {
    console.error('Error connecting to the database', err);
  }
};

export default configureDB;
