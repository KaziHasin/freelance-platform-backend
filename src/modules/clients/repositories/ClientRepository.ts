import { User } from '@/modules/users/models/User';
import { Client } from '../models/Client';
import type { IClient } from '../models/Client';

export class ClientRepository {
    async create(data: Partial<IClient>) {
        return await Client.create(data);
    }
    findById(id: string) {
        return User.findById(id)
            .populate({
                path: "client",
                populate: [
                    { path: "subscriptions", populate: { path: "packageId", select: "code price" } },
                    { path: "contactClickUsage.projectId", select: "name" },
                    { path: "projects", select: "title description createdAt" }
                ],
            });
    }

    find(filter: any, page = 1, limit = 20) {
        return User.find({ ...filter, role: "CLIENT" })
            .select("name email phone status provider createdAt")

            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });

    }
    count(filter: any) {
        return Client.countDocuments(filter);
    }
    update(id: string, data: Partial<IClient>) {
        return Client.findByIdAndUpdate(id, data, { new: true });
    }
    delete(id: string) {
        return Client.findByIdAndDelete(id);
    }
}
