import { OAuth2Client, LoginTicket } from "google-auth-library";
import { UserRepository } from "../repositories/UserRepository";
import { AuthService } from "./AuthService";
import { DeveloperService } from "@/modules/developers/services/DeveloperService";
import { ClientService } from "@/modules/clients/services/ClientService";

export class GoogleAuthService {
    private userRepo = new UserRepository();
    private client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    private authService = new AuthService();
    private developerService = new DeveloperService();
    private clientService = new ClientService();

    async loginOrSignup(data: { token: string; role: string }) {
        const ticket: LoginTicket = await this.client.verifyIdToken({
            idToken: data.token,
            audience: process.env.GOOGLE_CLIENT_ID as string,
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            throw new Error("Invalid Google token");
        }

        let user = await this.userRepo.findByEmail(payload.email);

        if (!user) {
            user = await this.userRepo.create({
                name: payload.name || "Google User",
                email: payload.email,
                provider: "google",
                role: data.role as any,
                status: "ACTIVE",
            });
        }

        await this.userRepo.update(user._id.toString(), {
            lastLoginAt: new Date(),
        });

        if (user.role === 'DEVELOPER') {
            await this.developerService.create({ userId: user._id });
        }

        if (user.role === 'CLIENT') {
            await this.clientService.create({ userId: user._id });
        }


        const tokens = this.authService.generateTokens(user);

        return { user, tokens };
    }
}
