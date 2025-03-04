import sql from 'mssql';
import config from './config/config';
import { connectDB } from './config/db.js';
import { app } from './app.js';

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
