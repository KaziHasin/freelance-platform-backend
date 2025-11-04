import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { IUser } from "../models/User";

export class AuthService {
    private accessTokenSecret: Secret = process.env.JWT_ACCESS_SECRET || "access_secret";
    private refreshTokenSecret: Secret = process.env.JWT_REFRESH_SECRET || "refresh_secret";
    private accessTokenExpiry = "15m";
    private refreshTokenExpiry = "2d";

    generateTokens(user: IUser) {
        const payload = {
            id: user._id,
            email: user.email,
            role: user.role,
        };

        const accessToken = jwt.sign(payload, String(this.accessTokenSecret), {
            expiresIn: this.accessTokenExpiry,
        } as SignOptions);

        const refreshToken = jwt.sign(payload, String(this.refreshTokenSecret), {
            expiresIn: this.refreshTokenExpiry,
        } as SignOptions);

        return { accessToken, refreshToken };
    }

    verifyAccessToken(token: string) {
        try {
            return jwt.verify(token, this.accessTokenSecret);
        } catch {
            return null;
        }
    }

    verifyRefreshToken(token: string) {
        try {
            return jwt.verify(token, this.refreshTokenSecret);
        } catch {
            return null;
        }
    }
}
