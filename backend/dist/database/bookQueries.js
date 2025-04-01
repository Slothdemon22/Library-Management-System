import sql from 'mssql';
import { database } from './dbController.js';
export class BookQueries {
    constructor() {
        console.log("Im Also private");
    }
    static getBookInstance() {
        if (!BookQueries.bookInstance) {
            this.bookInstance = new BookQueries();
        }
        return this.bookInstance;
    }
    async getBooks(id) {
        const result = (await database.getPool()).input('id', sql.Int, id).query('select * from Books where BookID=@id');
        return result;
    }
}
