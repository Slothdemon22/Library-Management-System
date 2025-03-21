import { Request, Response, NextFunction } from "express";
import jwt, {JwtPayload} from 'jsonwebtoken'
import 'dotenv/config';

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