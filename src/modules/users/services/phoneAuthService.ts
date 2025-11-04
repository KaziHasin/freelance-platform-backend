import { IUser } from "../models/User";
import { UserRepository } from "../repositories/UserRepository";
import crypto from "crypto";
import { AuthService } from "./AuthService";
import { DeveloperService } from "@/modules/developers/services/DeveloperService";
import { ClientService } from "@/modules/clients/services/ClientService";


export interface OtpResponse {
    message: string;
    otp: string;
};

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface VerifyOtpResponse {
    user: IUser;
    tokens: AuthTokens;
}


export class PhoneAuthService {
    private userRepo = new UserRepository();
    private authService = new AuthService();
    private developerService = new DeveloperService();
    private clientService = new ClientService();

    /**
     * Step 1: Request OTP (for both signup & login)
     * @param data { phone, role }
     * @returns { message, otp } 
     */
    async requestOtp(data: any): Promise<OtpResponse> {
        const { phone, role } = data;
        let user = await this.userRepo.findByPhone(phone);

        if (!user) {
            user = await this.userRepo.create({
                name: "Unknown",
                phone,
                provider: "phone",
                role: role as any,
                status: "ACTIVE",
            });
        }


        const otp = (crypto.randomInt(100000, 999999)).toString();

        await this.userRepo.update(user._id.toString(), {
            otp,
            otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
        });

        if (user.role === 'DEVELOPER') {
            await this.developerService.create({ userId: user._id });
        }

        if (user.role === 'CLIENT') {
            await this.clientService.create({ userId: user._id });
        }

        // TODO: send otp via SMS provider later
        return { message: "OTP generated", otp }; // return otp for dev only
    }

    /**
     * Step 2: Verify OTP (signup/login combined)
     * @param data {phone, otp}
     * @returns IUser
     */
    async verifyOtp(data: any): Promise<VerifyOtpResponse> {
        const { phone, otp } = data;
        const user = await this.userRepo.findByPhone(phone);
        if (!user) throw new Error("Phone not registered");

        if (!user.otp || !user.otpExpiresAt) throw new Error("OTP not requested");
        if (user.otpExpiresAt < new Date()) throw new Error("OTP expired");
        if (user.otp !== otp) throw new Error("Invalid OTP");

        await this.userRepo.update(user._id.toString(), {
            otp: null,
            otpExpiresAt: null,
            status: "ACTIVE",
            lastLoginAt: new Date(),
        });

        const tokens = this.authService.generateTokens(user);

        return { user, tokens };
    }
}
