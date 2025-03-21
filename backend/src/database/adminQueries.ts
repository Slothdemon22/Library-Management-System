import sql from 'mssql';
import { database } from './dbController.js';
export class  adminQueries {
    public static bookInstance: adminQueries
    private constructor() {
        console.log("Im Also private")
    }
    public static getBookInstance() {
        if (!adminQueries.bookInstance) {
            this.bookInstance = new adminQueries();
        }
        return this.bookInstance;
    }
    public async getBooks(id: number) {
        const result = (await database.getPool()).input('id', sql.Int, id).query('select * from Books where BookID=@id')
       
        return result;
    }

}