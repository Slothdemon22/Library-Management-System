import { Response, Request } from "express";
import { connectDB } from "../../config/db.js";

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

export const allBooks = async (req: Request, res: Response) => {
    try {
        const pool = await connectDB();
        
        const result = await pool.request()
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
                ORDER BY createdAt DESC
            `);

        if (!result.recordset || result.recordset.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: "No books found in the library" 
            });
        }

        const books = result.recordset.map(book => ({
            ...book,
            Reviews: book.Reviews ? book.Reviews.toString() : null
        }));

        res.status(200).json({
            success: true,
            count: books.length,
            books,
            status: 200
        });

    } catch (error:any) {
        console.error("[BOOKS ERROR]:", error);
        res.status(500).json({
            success: false,
            message: "Database operation failed",
            error: error.message,
            status: 500 
        });
    }
};