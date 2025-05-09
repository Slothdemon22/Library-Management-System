import {supabase} from "../../config/db.js"
import { Request, Response } from "express";



export const updateBorrowStatus=async (req:Request,res:Response)=>
{
    console.log("Approve Book called")
    console.log("Body : ", req.body)
    //cehck if book quanitty not zero 
    const {data:bookData,error:bookError}=await supabase
    .from("bookTable")
    .select("*")
    .eq("id",req.body.bookID)
    if(bookError)
    {
        console.log("Error : ", bookError)
        res.status(500).json({ message: "Error approving request" })
        return
    }
    if(bookData[0].quantity===0)
    {
        console.log("Book quantity is zero")
        res.status(500).json({ message: "Book quantity is zero" })
        return
    }   
    //check if already borrowed

    try
    {
        const {borrowRequestID,status,bookID,clerkID}=req.body
        const {data,error}=await supabase
        .from("borrowDetails")
        .insert({bookID,clerkID})
        .select()
        if(error)
        {
            console.log("Error : ", error)
            res.status(500).json({ message: "Error approving request" })
            return
        }
        console.log("Data : ", data)
        const {data:updateData,error:updateError}=await supabase
        .from("borrowRequests")
        .update({status})
        .eq("borrowRequestID",borrowRequestID)
        .select()
        if(updateError)
        {
            console.log("Error : ", updateError)
            res.status(500).json({ message: "Error approving request" })
            return
        }
        console.log("Update Data : ", updateData)
        //decrement book quantity
        const {data:bookquantity,error:bookquantityError}=await supabase
        .from("bookTable")
        .update({quantity:bookData[0].quantity-1})
        .eq("id",bookID)
        .select()
        if(bookquantityError)
        {
            console.log("Error : ", bookquantityError)
            res.status(500).json({ message: "Error approving request" })
            return
        }
        console.log("Book Data : ", bookquantity)
        
        
        res.status(200).json({ message: "Borrow request approved successfully" })
      
    }
    catch(error)
    {
        console.log("Error : ", error)
        res.status(500).json({ message: "Error approving request" })
        return
    }

}
