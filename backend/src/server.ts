import sql from 'mssql';
import config from './config/config.js';
import express from 'express';
import 'dotenv/config';
import router from './routes/authRoutes.js';
import cookieparser from 'cookie-parser'
import { connectDB } from './config/db.js';
import cors from 'cors'




const app = express();
app.use(express.json())
app.use(cookieparser());
app.use(cors(
  {
    origin:"*"
  }
))

const connection = async () => {
  try {
    
    const pool = await connectDB(); 
    
    console.log('✅ Connected to Azure SQL Database');
    
  } catch (error) {
    console.error('❌ Connection error:', error);
    process.exit(1);
  }
};



app.use('/api/auth', router)
connection()

const port = process.env.PORT;
app.listen(port||3000, () =>
{
  console.log(`Server is running on port ${port}`);


  
})
