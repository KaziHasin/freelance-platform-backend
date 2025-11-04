import { Request, Response, NextFunction } from "express";
import { AuthService } from "@/modules/users/services/AuthService";

const authService = new AuthService();

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken;
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    const decoded = authService.verifyAccessToken(token as string);
    if (!decoded) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }

    (req as any).user = decoded;
    next();
};
