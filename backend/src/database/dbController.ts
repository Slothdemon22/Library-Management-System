import sql, { pool } from 'mssql';
import config from '../config/config.js';
export class database
{
    public static instance: database;
    private static pool: Promise<sql.ConnectionPool>;

    private constructor()
    {
        console.log("Cant Touch This im private");
    }
    
    public static getInstance()
    {
        if (!this.instance)
        {
            this.instance = new database();
           
        }
        return this.instance;
    }

    public static async getPool()
    {
       
        return (await sql.connect(config)).request();
    }

   


};