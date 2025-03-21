import sql from 'mssql';
import config from './config.js';
export const connectDB = async () => {
    const pool = await sql.connect(config);
    //console.log("pool", pool.pool.used.length)
    // await sql.connect(config);
    // await sql.connect(config);
    // console.log(`✅ Connected to Azure SQL Database`);
    // console.log(`Active Connections: ${pool.pool.used.length}`);
    // console.log(`Idle Connections: ${pool.pool.free.length}`);
    // console.log(`Pending Requests: ${pool.pool.pendingAcquires.length}`);
    if (pool)
        return pool;
    else
        throw new Error('Database connection failed');
};

