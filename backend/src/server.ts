
import { connectDB } from './config/db.js';
import express from 'express';
import 'dotenv/config';
import router from './routes/authRoutes.js';
import cookieparser from 'cookie-parser'

const app = express();
app.use(express.json())
app.use(cookieparser())

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

app.use('/api/auth', router)

const port = process.env.PORT;
app.listen(port||3000, () =>
{
   console.log(`Server is running on port ${port}`);
})
