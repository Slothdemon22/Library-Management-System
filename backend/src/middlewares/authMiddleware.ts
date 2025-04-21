import { Request, Response, NextFunction } from "express";
import jwt, {JwtPayload} from 'jsonwebtoken'
import 'dotenv/config';
import { connectDB } from "../config/db";
import sql from 'mssql'

interface AuthRequest extends Request {
    user?: string | JwtPayload;
}


export const verifyCookie = (req:AuthRequest, res:Response, next:NextFunction)=>
{
    try {
        const token = req.cookies?.token;
        if(!token)
        {
            return res.status(401).json({
                message: "Unauthorized: No token provided",
                status: 401,
            });
        }
    
        const decode = jwt.verify(token, process.env.JWT_SECRET as string);
        if(!decode)
        {
            return res.status(401).json({
                message: "could not decode",
                status: 401,
            });
        }
    
        req.user = decode;
        next();
    
    } catch (error) {
        res.status(401).json({
            message: "Unauthorized: Invalid token",
            status: 401,
        });
    }}
    
    export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
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
          .query(`SELECT ISADMIN FROM dbo.Users WHERE USERID = @uID`);
    
        const isAdmin = result.recordset[0]?.ISADMIN;
    
        if (!isAdmin) {
          return res.status(403).json({
            message: "Access denied. User is not an admin.",
            status: 403,
          });
        }
    
        next(); 
      } catch (error: any) {
        console.error("Error checking admin status:", error);
        res.status(500).json({
          message: error.message || "Internal Server Error",
          status: 500,
        });
      }
    };
    