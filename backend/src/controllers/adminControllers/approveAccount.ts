import { Response, Request } from "express";
import { connectDB } from "../../config/db.js";
import sql from "mssql";

export const approveAccount = async (req: Request, res: Response) => {
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
      .query(`UPDATE dbo.Users SET ISAPPROVED = 1 WHERE USERID = @uID`);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        message: "User not found.",
        status: 404,
      });
    }

    return res.status(200).json({
      message: "User account approved successfully.",
      status: 200,
    });

  } catch (error: any) {
    console.error("Error approving account:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
      status: 500,
    });
  }
};
