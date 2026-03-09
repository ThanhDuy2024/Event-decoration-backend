import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'
import { client } from "../interfaces/users.interface";
export const usersMiddleware = (req: client, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.usersToken;

        if (!token) {
            return res.status(400).json({
                code: "error",
                message: 'Toke expire!'
            })
        }

        const decode = jwt.verify(token, String(process.env.JWT_PRIVATE_KEY)) as JwtPayload;

        if (!decode) {
            return res.status(400).json({
                code: "error",
                message: 'Toke expire!'
            })
        };

        req.client = {
            id: decode.id,
            username: decode.username,
        };
        
        next();
    } catch (error) {
        console.log(error);
        res.status(400).json({
            code: "error",
            message: 'Toke expire!'
        })
    }
}