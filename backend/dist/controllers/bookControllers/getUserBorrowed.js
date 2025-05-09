import { supabase } from "../../config/db.js";
export const getUserBorrowedBooks = async (req, res) => {
    try {
        const { userID } = req.body; // Assuming userId is sent in the request body
        if (!userID) {
            res.status(400).json({ message: "User ID is required" });
            return;
        }
        const { data, error } = await supabase
            .from("borrowDetails")
            .select("*,book:bookID(*),user:userID(*)") // Select the user and book details as well
            .eq("userID", userID);
        console.log("data :", data);
        if (error) {
            console.error("Error fetching borrowed books:", error);
            res.status(500).json({ message: "Error fetching borrowed books" });
            return;
        }
        if (!data || data.length === 0) {
            res.status(404).json({ message: "No borrowed books found for this user" });
            return;
        }
        res.status(200).json({ borrowedBooks: data });
    }
    catch (error) {
        console.error("Error fetching borrowed books:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
