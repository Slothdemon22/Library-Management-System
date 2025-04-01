import {z} from "zod"
import { Request, Response } from "express";
import bcrypt from "bcryptjs"
import sql, {NVarChar, VarChar} from 'mssql';
import { connectDB } from "../../config/db.js";
import jwt from 'jsonwebtoken'
import { loginSchema } from "../../types/userTypes.js";

export const login = async(req: Request, res: Response): Promise<void> =>
    {
        try {
            console.log("Incoming Body : ",req.body);
            const parsedData = loginSchema.safeParse(req.body);
            console.log('parsed data: ',parsedData);
        
            if(!parsedData.success)
                {
                    res.status(400).json({
                        message: "Zod Error",
                        status: 400,
                        error: parsedData.error.format()
                    })
                    return
                }
        
            const {email, password} = parsedData.data;

            const pool = await connectDB();
            const result = await pool.request()
            .input("email", sql.VarChar(100),email)
            .query(`SELECT * from dbo.users where EMAIL = @email`)
            
            console.log("-------------After query---------------");
            const user = result.recordset[0];
            console.log(user);
            if(!user)
            {
                console.log("Not Found");
                res.status(401).json({
                    message: "User Not Found",
                    status: 400,
                })
                return
            }
            console.log("login route before password");
            const isPasswordCorrect = await bcrypt.compare(password, user.PASSWORD);
    
            // const hashedPassword: string = await hashPassword(password);
            // console.log(hashedPassword);
            // console.log(user.passwordHash);
    
            if(!isPasswordCorrect)
            {
                res.status(401).json({
                    message: "Password Incorrect.",
                    status: 401,
                })
                return
            }
        
            //login success
    
            const token = jwt.sign({id: user.userId}, process.env.JWT_SECRET!, {expiresIn: '1h'});
    
            res.cookie('token', token, {
                httpOnly: true, 
                secure: true,
                maxAge: 3600000, 
                sameSite: 'strict'
            });
        
            res.status(200).json({
                message: "Login successful",
                status: 200,
                user: 
                {
                    userId: user.userId,
                    fullName: user.name,
                    email: user.email,
                    university: user.university,
                    universityID: user.universityID,
                }
            })
        } catch (error) {
            console.error("Error during login:", error);
            res.status(500).json({
                message: "Internal Server Error",
                status: 500,
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    