import { Request, Response, NextFunction } from "express";
import 'dotenv/config';
import { connectDB } from "../config/db";
import sql from 'mssql'

export const isUserApproved = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user_id = req.body.user_id;

    if (!user_id) {
      return res.status(400).json({
        message: "User ID is required",
        status: 400,
      });
    }

    const pool = await connectDB();
    const result = await pool.request()
      .input("uID", sql.Int, user_id)
      .query(`SELECT ISAPPROVED FROM dbo.Users WHERE USERID = @uID`);

    const isApproved = result.recordset[0]?.ISAPPROVED;

    if (!isApproved) {
      return res.status(403).json({
        message: "User account is not approved yet.",
        status: 403,
      });
    }

    next();

  } catch (error: any) {
    console.error("Error checking approval status:", error);
    res.status(500).json({
      message: error.message || "Internal server error",
      status: 500,
    });
  }
};

    