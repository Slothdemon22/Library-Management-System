
import { connectDB } from './config/db.js';
import express from 'express';
import 'dotenv/config';

const app = express();
const connection = async () => {
  try {
    
    const pool = await connectDB(); 
    
    console.log('✅ Connected to Azure SQL Database');
    
  } catch (error) {
    console.error('❌ Connection error:', error);
    process.exit(1);
  }
};

connection(); 

const port = process.env.PORT;
app.listen(port||3000, () =>
{
   console.log(`Server is running on port ${port}`);
})
