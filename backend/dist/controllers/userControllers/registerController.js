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
        console.log("Body: ", request.body);
        const parsedData = UserSchema.safeParse(request.body);
        console.log("Parsed data: ", parsedData);
        if (!parsedData.success) {
            response.status(400).json({
                message: "Validation Error",
                status: 400,
                error: parsedData.error.format(),
            });
            return;
        }
        const { fullName, password, email } = parsedData.data;
        const hashedPassword = await hashPassword(password);
        const pool = await connectDB();
        const result = await pool.request()
            .input("EMAIL", sql.VarChar(100), email)
            .query(`SELECT * FROM dbo.Users WHERE EMAIL = @EMAIL`);
        const existingUser = result.recordset[0];
        if (existingUser) {
            response.status(400).json({
                message: "Email is already in use",
                status: 400,
            });
            return;
        }
        const insertResult = await pool.request()
            .input("FullName", sql.VarChar(255), fullName)
            .input("Password", sql.VarChar(255), hashedPassword)
            .input("Email", sql.VarChar(100), email)
            .query(`
            INSERT INTO dbo.Users (DISPLAYNAME, PASSWORD, EMAIL)
            OUTPUT INSERTED.UserID, INSERTED.DISPLAYNAME, INSERTED.EMAIL
            VALUES (@FullName, @Password, @Email);
        `);
        const insertedUserId = insertResult.recordset[0].USERID;
        response.status(201).json({
            message: "User Created Successfully",
            status: 201,
            user: {
                userId: insertedUserId,
                fullName,
                email,
            },
        });
    }
    catch (error) {
        console.log("Error due to: ", error);
        response.status(500).json({
            message: "Internal Server Error",
            error: error,
            status: 500,
        });
    }
};
