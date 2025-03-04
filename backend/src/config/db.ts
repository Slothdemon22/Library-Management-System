import sql from 'mssql';
import config from './config.js';
export const connectDB = async() =>
{
  const pool = await sql.connect(config);
  if (pool)
    return pool;
  else 
    throw new Error('Database connection failed');
    
}