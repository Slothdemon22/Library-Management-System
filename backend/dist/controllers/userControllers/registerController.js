import bcrypt from "bcryptjs";
import sql from 'mssql';
import { connectDB } from "../../config/db.js";
import { UserSchema } from "../../types/userTypes.js";
const hashPassword = async (password) => {
    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(password, salt);
    return hash;
};
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
