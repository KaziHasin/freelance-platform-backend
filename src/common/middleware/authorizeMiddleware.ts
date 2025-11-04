import { Request, Response, NextFunction } from "express";
import { Role } from "../types/enums";

export const authorize =
    (...allowedRoles: Role[]) =>
        (req: Request, res: Response, next: NextFunction) => {
            const user = (req as any).user;

            if (!user) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            // Admin can access all routes
            if (user.role === Role.ADMIN) {
                return next();
            }

            // Check if user's role is in allowed roles
            if (!allowedRoles.includes(user.role)) {
                return res.status(403).json({ message: "Forbidden: Insufficient role" });
            }

            next();
        };
