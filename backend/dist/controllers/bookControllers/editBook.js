import { supabase } from "../../lib/db.js";
export const editBook = async (req, res) => {
    console.log("🔧 Edit Book Request Received");
    console.log("📦 Request Body:", req.body);
    const { id, title, author, genre, bookImage, bookDetails, bookSummary, quantity } = req.body;
    if (!id) {
        res.status(400).json({
            success: false,
            message: "Missing book ID for update",
        });
        return;
    }
    // Prepare the fields to update, making sure only the necessary fields are included
    const updateFields = {
        title,
        author,
        genre,
        bookImage,
        bookDetails,
        bookSummary,
        quantity,
    };
    try {
        const { data, error } = await supabase
            .from("bookTable")
            .update(updateFields)
            .eq("id", id)
            .select(); // Select the updated row to return it
        if (error) {
            console.error("❌ Supabase update error:", error);
            res.status(500).json({
                success: false,
                message: "Failed to update the book",
            });
            return;
        }
        if (!data || data.length === 0) {
            res.status(404).json({
                success: false,
                message: "Book not found or no changes made",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Book updated successfully",
            updatedBook: data[0], // Return the updated book data
        });
        return;
    }
    catch (err) {
        console.error("🔥 Unexpected error:", err);
        res.status(500).json({
            success: false,
            message: "Server error while updating book",
        });
        return;
    }
};
