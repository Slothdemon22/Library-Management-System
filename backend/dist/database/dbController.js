import sql from 'mssql';
import config from '../config/config.js';
export class database {
    constructor() {
        console.log("Cant Touch This im private");
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new database();
        }
        return this.instance;
    }
    static async getPool() {
        return (await sql.connect(config)).request();
    }
}
;
