import {supabase} from "../../config/db.js"
import { Request, Response } from "express";



export const requestBook = async (req: Request, res: Response): Promise<void> => {


    try
    {

        const { bookID, userID } = req.body;
        console.log("bookId :", bookID)
        console.log("userId :", userID)

        if (!bookID || !userID) {
            res.status(400).json({ message: "Book ID and User ID are required" });
            return;
        }

        const { data, error } = await supabase
            .from("borrowRequests")
            .insert([{ bookID, userID}])
            .select("*,user:userID(*),book:bookID(*)") // Select the user and book details as well;

        if (error) {
            console.error("Error requesting book:", error);
            res.status(400).json({ message: "Error while requesting book" });
            return;
        }

        if (!data || data.length === 0) {
            res.status(404).json({ message: "Request not found" });
            return;
        }

        res.status(200).json({ message: "Book requested successfully", request: data });
    }
    catch (error)
    {
        console.error("Error requesting book:", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }

}    
