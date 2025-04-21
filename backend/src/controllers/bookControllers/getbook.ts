import { Response, Request } from "express";
import { connectDB } from "../../config/db.js";
import sql from 'mssql'

interface Book {
    BookID: number;
    Title: string;
    Author: string;
    Genre: string;
    BookImage: string | null;
    PrimaryColor: string | null;
    BookDetails: number | null;
    Quantity: number;
    Book_Summary: string | null;
    createdAt: Date;
    Reviews: bigint | null;
}

export const getBook = async (req: Request, res: Response) => {
    try {

        const book_id = req.params.book_id;

        const pool = await connectDB();
        
        const result = await pool.request()
            .input("book_ID", sql.Int, book_id)
            .query<Book>(`
                SELECT 
                    BookID,
                    Title,
                    Author,
                    Genre,
                    BookImage,
                    PrimaryColor,
                    BookDetails,
                    Quantity,
                    Book_Summary,
                    createdAt,
                    Reviews
                FROM dbo.books
                where BookID = @book_ID
            `);

        if (!result.recordset[0] ) {
            return res.status(404).json({ 
                success: false,
                message: "book not found in the library" 
            });
        }

        const book = result.recordset[0]

        res.status(200).json({
            success: true,
            book,
            status: 200
        });

    } catch (error:any) {
        console.error("[BOOK ERROR]:", error);
        res.status(500).json({
            success: false,
            message: "Database operation failed",
            error: error.message,
            status: 500 
        });
    }
};