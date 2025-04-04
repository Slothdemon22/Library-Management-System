import { bookSchema } from "../../types/bookTypes.js";
import sql from 'mssql';
import { connectDB } from "../../config/db.js";
export const addBook = async (req, res) => {
    try {
        console.log("Before parsing data : ", req.body);
        console.log("author : ", req.body.author);
        const parsedData = bookSchema.safeParse(req.body);
        console.log("After parsing data : ", req.body);
        if (!parsedData.success) {
            res.status(400).json({
                message: "Invalid data format",
                status: 400
            });
            return;
        }
        const { title, author, genre, bookImage, primaryColor, bookDetails, quantity = 1, bookSummary, } = req.body;
        // Connect to database (assuming you have a connection pool set up elsewhere)
        const pool = await connectDB();
        // Insert query
        const result = await pool.request()
            .input('title', sql.VarChar, title)
            .input('author', sql.VarChar, author)
            .input('genre', sql.VarChar, genre)
            .input('bookImage', sql.VarChar, bookImage)
            .input('primaryColor', sql.VarChar, primaryColor)
            .input('bookDetails', sql.VarChar, bookDetails)
            .input('quantity', sql.Int, quantity)
            .input('bookSummary', sql.Text, bookSummary)
            .query(`
        INSERT INTO dbo.Books (Title, Author, Genre, BookImage, PrimaryColor, BookDetails, Quantity, Book_Summary, createdAt)
        VALUES (@title, @author, @genre, @bookImage, @primaryColor, @bookDetails, @quantity, @bookSummary, GETDATE());
        
        SELECT SCOPE_IDENTITY() AS BookID;
      `);
        const bookId = result.recordset[0].BookID;
        res.status(201).json({
            message: "Book added successfully",
            status: 201,
            bookId
        });
    }
    catch (error) {
        console.log("In catch block ");
        console.error("Error adding book:", error);
        res.status(500).json({
            message: error.message,
            status: 500
        });
    }
};
