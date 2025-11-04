import { PackageRepository } from '@/modules/packages/repositories/PackageRepository';
import { ClientRepository } from '../repositories/ClientRepository';
import { SubscriptionRepository } from '@/modules/subscriptions/repositories/SubscriptionRepository';
import { Types } from 'mongoose';

export class ClientService {
    constructor(private repo = new ClientRepository(), private packageRepo = new PackageRepository(), private subscriptionRepo = new SubscriptionRepository()) { }

    async create(data: any) {
        const client = await this.repo.create(data);
        const freePackage = await this.packageRepo.findOne({ code: 'FREE' });

        if (freePackage) {
            const subscriptionData = {
                clientId: client._id as Types.ObjectId,
                packageId: freePackage._id as Types.ObjectId,
                startDate: new Date(),
                isTrial: true,
            };

            await this.subscriptionRepo.create(subscriptionData);
        }

        return client;
    }
    get(id: string) {
        return this.repo.findById(id);
    }
    async list(q?: string, status?: string, page = 1, limit = 20) {
        const filter: any = {};
        if (q) {
            filter.$or = [
                { email: new RegExp(q, 'i') },
                { phone: new RegExp(q, 'i') },
                { name: new RegExp(q, 'i') }
            ];
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
    update(id: string, data: any) {
        return this.repo.update(id, data);
    }
    remove(id: string) {
        return this.repo.delete(id);
    }
}
