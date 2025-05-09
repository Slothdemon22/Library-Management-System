import { Request, Response } from 'express'
import { supabase } from '../../lib/db.js'

export const getUserBorrowedBooks = async (req: Request, res: Response) => {
    const {clerkID}=req.body
    console.log("clerkID : ", clerkID)
    //i want each book
    const {data,error}=await supabase
    .from("borrowDetails")
    .select("*,bookDetails:bookID(*)")
    .eq("clerkID",clerkID)
    if(error)
    {
        console.log("Error : ", error)
        res.status(500).json({ message: "Error fetching borrowed books" })
        return
    }
    console.log("Data : ", data)
    res.status(200).json({ message: "Borrowed books fetched successfully", data })


}
