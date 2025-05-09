import { supabase } from "../../config/db.js";
import { Request, Response } from "express";



export const getRequests = async (req: Request, res: Response): Promise<void> => {
    console.log("getRequests called")

    try{
        const {data,error}=await supabase.from("borrowRequests")
        .select("*,user:clerkID(*),book:bookID(*)") // Select the user and book details as well;
        console.log("data :",data)
        if (error) {
            console.error("Error fetching requests:", error);
            res.status(400).json({ message: "Error while fetching requests" });
            return;
        }
        if (!data || data.length === 0) {
            res.status(404).json({ message: "No requests found" });
            return;
        }
        res.status(200).json({ message: "Requests fetched successfully", requests: data });

    }
    catch(error){
        console.error("Error fetching requests:", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }

}