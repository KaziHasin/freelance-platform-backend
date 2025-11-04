import bcrypt from "bcryptjs";
import { UserRepository } from "../repositories/UserRepository";
import { AuthService } from "./AuthService";
import { DeveloperService } from "@/modules/developers/services/DeveloperService";
import { ClientService } from "@/modules/clients/services/ClientService";

export class EmailAuthService {
    private userRepo = new UserRepository();
    private authService = new AuthService();
    private developerService = new DeveloperService();
    private clientService = new ClientService();

    async signup(data: { name: string; email: string; password: string; role: string }) {
        const existing = await this.userRepo.findByEmail(data.email);
        if (existing) throw new Error("Email already exists");

        const hash = await bcrypt.hash(data.password, 10);
        const user = await this.userRepo.create({
            name: data.name,
            email: data.email,
            passwordHash: hash,
            provider: "local",
            role: data.role as any,
            status: "ACTIVE",
        });

        if (user.role === 'DEVELOPER') {
            await this.developerService.create({ userId: user._id });
        }

        if (user.role === 'CLIENT') {
            await this.clientService.create({ userId: user._id });
        }

        const tokens = this.authService.generateTokens(user);
        const { passwordHash, __v, ...safeUser } = user.toObject();
        return { user: safeUser, tokens };
    }

    async login(data: { email: string; password: string }) {
        const user = await this.userRepo.findByEmail(data.email);
        if (!user) throw new Error("Invalid credentials");

        const match = await bcrypt.compare(data.password, user.passwordHash!);
        if (!match) throw new Error("Invalid credentials");

        await this.userRepo.update(user._id.toString(), { lastLoginAt: new Date() });

        const tokens = this.authService.generateTokens(user);

        const { passwordHash, __v, ...safeUser } = user.toObject();

        return { user: safeUser, tokens };
    }

}
