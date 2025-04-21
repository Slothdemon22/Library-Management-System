import { connectDB } from "../../config/db.js";
import sql from 'mssql';
export const deleteBook = async (req, res) => {
    try {
        const book_id = req.body.book_id;
        console.log("Book ID: ", book_id);
        if (!book_id) {
            res.status(400).json({
                message: "Invalid Book ID.",
                status: 400,
            });
            return;
        }
        const pool = await connectDB();
        const result = await pool.request()
            .input("id_book", sql.Int, book_id)
            .query(`DELETE FROM dbo.Books WHERE BookID = @id_book`);
        res.status(200).json({
            message: "Book deleted successfully",
            status: 200,
        });
    }
    catch (error) {
        console.log("In catch block");
        console.error("Error deleting book:", error);
        res.status(500).json({
            message: error.message,
            status: 500,
        });
    }
};
