
import { UserRepository } from '../repositories/UserRepository';
import bcrypt from 'bcryptjs';
import { ClientService } from '@/modules/clients/services/ClientService';
import { DeveloperService } from '@/modules/developers/services/DeveloperService';

export class UserService {
    constructor(private repo = new UserRepository(), private clientService = new ClientService(), private developerService = new DeveloperService()) { }

    async create(data: any) {
        if (data.email) {
            const existing = await this.repo.findOne({ email: data.email });
            if (existing) {
                const err: any = new Error('Email already exists');
                err.field = 'email';
                throw err;
            }
        }

        const toCreate = { ...data };
        if (data.password) {
            toCreate.passwordHash = await bcrypt.hash(data.password, 10);
            delete toCreate.password;
        }

        const user = await this.repo.create(toCreate);

        if (user.role === 'CLIENT') {
            await this.clientService.create({ userId: user._id });
        }

        if (user.role === 'DEVELOPER') {
            await this.developerService.create({ userId: user._id });
        }

        return user;
    }

    get(id: string) {
        return this.repo.findById(id);
    }

    async list(q?: string, role?: string, status?: string, page = 1, limit = 20) {
        const filter: any = {};

        if (q) {
            filter.$or = [
                { email: new RegExp(q, 'i') },
                { phone: new RegExp(q, 'i') },
                { name: new RegExp(q, 'i') }
            ];
        }

        if (role) {
            filter.role = role.toUpperCase();
        }

        if (status) {
            filter.status = status.toUpperCase();
        }

        const [items, total] = await Promise.all([
            this.repo.find(filter, page, limit),
            this.repo.count(filter)
        ]);

        return { items, total, page, limit };
    }


    async update(id: string, data: any) {
        const { name, email, phone } = data;
        const toUpdate = { name, email, phone };
        return this.repo.update(id, toUpdate);
    }

    remove(id: string) {
        return this.repo.delete(id);
    }
}
