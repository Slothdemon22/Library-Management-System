
import { Request, Response } from "express";





export const logout = (req: Request, res: Response): void => {
    res.clearCookie('token'); 
    res.status(200).json({
        message: "Logout successful",
        status: 200,
    });
};

