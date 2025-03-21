import { z } from "zod";
import bcrypt from "bcryptjs";
import sql from 'mssql';
import { connectDB } from "../config/db.js";
import jwt from 'jsonwebtoken';
import 'dotenv/config';
const hashPassword = async (password) => {
    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(password, salt);
    return hash;
};
const UserSchema = z.object({
    userId: z.string().min(1, "UserId is required"),
    fullName: z.string().min(5, "Full Name is required"),
    password: z.string().min(10, "Password is compulsory"),
    email: z.string().min(11, "Email is compulsory"),
    university: z.string().min(10, "Universoty Name is Compulsory"),
    universityID: z.string().min(10, "UniID give asap"),
});
const loginSchema = z.object({
    userId: z.string().min(1, "User ID is required."),
    password: z.string().min(1, "Password is required.")
});
export const createUser = async (request, response) => {
    try {
        const parsedData = UserSchema.safeParse(request.body);
        // console.log("body: ", request.body);
        // console.log("parsed data: ", parsedData);
        if (!parsedData.success) {
            response.status(400).json({
                message: "Zod Error",
                status: 400,
                error: parsedData.error.format()
            });
            return;
        }
        const { userId, fullName, password, email, university, universityID } = parsedData.data;
        const hashedPassword = await hashPassword(password);
        const pool = await connectDB();
        const result = await pool.request()
            .input("userId", sql.VarChar(100), userId)
            .query(`SELECT * from dbo.users where userId = @userId`);
        const user = result.recordset[0];
        if (!user) {
            response.status(400).json({
                message: "User Id already in use",
                status: 400,
            });
            return;
        }
        await pool.request()
            .input("fullName", sql.NVarChar(100), fullName)
            .input("password", sql.NVarChar(255), hashedPassword)
            .input("email", sql.NVarChar(255), email)
            .input("date", sql.DateTime, new Date())
            .input("university", sql.VarChar(100), university)
            .input("universityID", sql.VarChar(100), universityID)
            .input("userId", sql.VarChar(100), userId)
            .input("isAdmin", sql.Bit, false)
            .input("isApproved", sql.Bit, false)
            .input("fines", sql.Int, 0)
            .input("ProfilePic", sql.VarChar(255), null)
            .input("borrowedBooks", sql.Int, 0)
            .query(`insert into dbo.Users ( [name], email, passwordHash, createdAt, isAdmin, isApproved, borrowedBooks, university, universityID, fines, ProfilePic, userId)
    values (@fullName, @email, @password, @date, @isAdmin, @isApproved, @borrowedBooks, @university, @universityID, @fines, @ProfilePic, @userId )`);
        response.status(201).json({
            message: "User Created Successfully",
            status: 201,
            user: {
                userId,
                fullName,
                password: hashedPassword,
                email,
                university,
                universityID,
            }
        });
    }
    catch (error) {
        console.log("Error Due to: ", error);
        response.status(500).json({
            message: "Error",
            error: error,
            status: 400
        });
    }
};
export const login = async (req, res) => {
    try {
        const parsedData = loginSchema.safeParse(req.body);
        if (!parsedData.success) {
            res.status(400).json({
                message: "Zod Error",
                status: 400,
                error: parsedData.error.format()
            });
            return;
        }
        const { userId, password } = parsedData.data;
        const pool = await connectDB();
        const result = await pool.request()
            .input("userId", sql.VarChar(100), userId)
            .query(`SELECT * from dbo.users where userId = @userId`);
        const user = result.recordset[0];
        if (!user) {
            res.status(400).json({
                message: "User Not Found",
                status: 400,
            });
            return;
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
        // const hashedPassword: string = await hashPassword(password);
        // console.log(hashedPassword);
        // console.log(user.passwordHash);
        if (!isPasswordCorrect) {
            res.status(400).json({
                message: "Password Incorrect.",
                status: 400,
            });
            return;
        }
        //login success
        const token = jwt.sign({ id: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            maxAge: 3600000,
            sameSite: 'strict'
        });
        res.status(200).json({
            message: "Login successful",
            status: 200,
            user: {
                userId: user.userId,
                fullName: user.name,
                email: user.email,
                university: user.university,
                universityID: user.universityID,
            }
        });
    }
    catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({
            message: "Internal Server Error",
            status: 500,
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
export const logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({
        message: "Logout successful",
        status: 200,
    });
};
