import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { admin } from "../interfaces/confirm.interface";
export const adminMiddleware = (req: admin, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.adminToken;
    const checkJwt = jwt.verify(token, String(process.env.JWT_PRIVATE_KEY)) as JwtPayload
    
    if (!checkJwt) {
      return res.status(401).json({
        code: 'Unauthorized',
        message: "Token invalid!"
      })
    };

    req.admin = {
      id: checkJwt.id,
    }
    next()
  } catch (error) {
    console.log(error);
    res.status(401).json({
      code: "Unauthorized",
      message: "Token invalid!"
    })
  }
}