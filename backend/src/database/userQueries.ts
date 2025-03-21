import sql from 'mssql';
import { database } from './dbController.js';
export class  UserQueries {
    public static bookInstance: UserQueries
    private constructor() {
        console.log("Im Also private")
    }
    public static getBookInstance() {
        if (!UserQueries.bookInstance) {
            this.bookInstance = new UserQueries();
        }
        return this.bookInstance;
    }
    public async getBooks(id: number) {
        const result = (await database.getPool()).input('id', sql.Int, id).query('select * from Books where BookID=@id')
       
        return result;
    }

}