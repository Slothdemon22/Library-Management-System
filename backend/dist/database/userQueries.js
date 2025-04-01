import sql from 'mssql';
import { database } from './dbController.js';
export class UserQueries {
    constructor() {
        console.log("Im Also private");
    }
    static getBookInstance() {
        if (!UserQueries.bookInstance) {
            this.bookInstance = new UserQueries();
        }
        return this.bookInstance;
    }
    async getBooks(id) {
        const result = (await database.getPool()).input('id', sql.Int, id).query('select * from Books where BookID=@id');
        return result;
    }
}
