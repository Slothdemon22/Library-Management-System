import sql from 'mssql';
import { database } from './dbController.js';
export class BookQueries
{
    public static bookInstance: BookQueries
    private constructor()
    {
        console.log("Im Also private")
    }
    public static getBookInstance() {
        if (!BookQueries.bookInstance) {
            this.bookInstance = new BookQueries();
        }
        return this.bookInstance;
    }
    public async getBooks(id: number)
    {
        const result = (await database.getPool()).input('id', sql.Int, id).query('select * from Books where BookID=@id')
       
        return result;
    }

}