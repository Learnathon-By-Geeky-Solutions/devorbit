import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const dbUrl = process.env.MONGO_URI;

if (!dbUrl) {
  throw new Error('MONGO_URI environment variable is not defined');
}

const connectDB = async () => {
  try {
    await mongoose.connect(dbUrl);
    console.log('Connected to the db');
  } catch (err) {
    console.error('Failed to connect to the db', err);
    process.exit(1);
  }
};

export default connectDB;