import { asyncHandler } from "@/common/utils/asyncHandler";
import { EmailSignupDto, EmailLoginDto, GoogleAuthDto, PhoneRequestDto, PhoneOtpVerifyDto } from "../dtos/AuthDto";
import { Request, Response } from 'express';
import { validate } from "@/common/middleware/validate";
import { EmailAuthService } from "../services/emailAuthService";
import { PhoneAuthService } from "../services/phoneAuthService";
import { GoogleAuthService } from "../services/googleAuthService";
import { setAuthCookies } from "@/common/utils/cookieHelper";
import { AuthService } from "../services/AuthService";
import { UserService } from "../services/UserService";
import { JwtPayload } from "jsonwebtoken";

const emailService = new EmailAuthService();
const phoneService = new PhoneAuthService();
const googleService = new GoogleAuthService();
const authService = new AuthService();
const userService = new UserService();


export const emailSignup = [
    validate(EmailSignupDto),
    asyncHandler(async (req: Request, res: Response) => {
        const { user, tokens } = await emailService.signup(req.body);
        setAuthCookies(res, tokens);
        res.json({ success: true, user, tokens });
    }),
];

export const emailLogin = [
    validate(EmailLoginDto),
    asyncHandler(async (req: Request, res: Response) => {
        const { user, tokens } = await emailService.login(req.body);
        setAuthCookies(res, tokens);
        res.json({ success: true, user, tokens });
    }),
];

export const requestOtp = [
    validate(PhoneRequestDto),
    asyncHandler(async (req: Request, res: Response) => {
        const user = await phoneService.requestOtp(req.body);
        res.json({ success: true, user });
    })
]

export const verifyPhoneOtp = [
    validate(PhoneOtpVerifyDto),
    asyncHandler(async (req: Request, res: Response) => {
        const { user, tokens } = await phoneService.verifyOtp(req.body);
        setAuthCookies(res, tokens);
        res.json({ success: true, user, tokens });
    })
]

export const googleAuth = [
    validate(GoogleAuthDto),
    asyncHandler(async (req: Request, res: Response) => {
        const { user, tokens } = await googleService.loginOrSignup(req.body);
        setAuthCookies(res, tokens);
        res.json({ success: true, user });
    })
]

export const authMe = [
    asyncHandler(async (req: Request, res: Response) => {
        const userId = (req.user as JwtPayload)?.id;

        const user = await userService.get(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
        });
    }),
];


export const refreshToken = [
    asyncHandler(async (req: Request, res: Response) => {
        const token = req.cookies?.refreshToken;
        if (!token) {
            return res.status(403).json({ message: "No refresh token provided" });
        }

        const decoded = authService.verifyRefreshToken(token) as JwtPayload | null;
        if (!decoded) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        const user = await userService.get(decoded.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const newTokens = authService.generateTokens(user);

        setAuthCookies(res, newTokens);
        res.json({
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });
    }),
];

export const logout = [
    asyncHandler(async (req: Request, res: Response) => {
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        res.json({ success: true, message: "Logged out successfully" });
    }),
];





