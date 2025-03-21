import jwt from 'jsonwebtoken';
import 'dotenv/config';
export const verifyCookie = (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized: No token provided",
                status: 401,
            });
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if (!decode) {
            return res.status(401).json({
                message: "could not decode",
                status: 401,
            });
        }
        req.user = decode;
        next();
    }
    catch (error) {
        res.status(401).json({
            message: "Unauthorized: Invalid token",
            status: 401,
        });
    }
};
