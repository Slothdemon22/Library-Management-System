import { supabase } from "../../config/db.js";
export const approveBook = async (req, res) => {
    try {
        console.log("Body :", req.body);
        const { userID, bookID } = req.body;
        const { data, error } = await supabase
            .from("borrowRequests")
            .select("userID,bookID")
            .eq("userID", userID)
            .eq("bookID", bookID);
        console.log("data :", data);
        if (error) {
            console.error("Error fetching request:", error);
            res.status(400).json({ message: "Error while fetching request" });
            return;
        }
        if (!data || data.length === 0) {
            res.status(404).json({ message: "Request not found" });
            return;
        }
        const { data: approveBook, error: approveerror } = await supabase
            .from("borrowDetails")
            .insert([{ userID, bookID }])
            .select("*");
        console.log("approveBook :", approveBook);
        if (approveerror) {
            console.error("Error approving book:", approveerror);
            res.status(400).json({ message: "Error while approving book" });
            return;
        }
        if (!approveBook || approveBook.length === 0) {
            res.status(404).json({ message: "Book not found" });
            return;
        }
        const { data: changeStatus, error: changeStatusError } = await supabase
            .from("borrowRequests")
            .update({ status: true })
            .eq("userID", userID)
            .eq("bookID", bookID)
            .select("*");
        console.log("changeStatus :", changeStatus);
        res.status(200).json({ message: "Book approved successfully", request: approveBook });
        return;
    }
    catch (error) {
        console.error("Error approving book:", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
};
