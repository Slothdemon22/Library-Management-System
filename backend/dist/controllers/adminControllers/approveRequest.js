import { supabase } from "../../config/db.js";
export const requestBook = async (req, res) => {
    const { clerkID, bookID } = req.body;
    console.log("Body : ", req.body);
    res.status(200).json({ message: "Requested successfully" });
    try {
        const { data, error } = await supabase
            .from("borrowRequests")
            .insert({ clerkID, bookID })
            .select();
        if (error) {
            console.error("Failed to insert borrow request:", error.message);
            res.status(500).json({ message: "Error approving request" });
            return;
        }
        console.log("Data : ", data);
    }
    catch (error) {
        console.log("Error : ", error);
        res.status(500).json({ message: "Error approving request" });
    }
};
