import { SubscriptionStatus } from "@/common/types/enums";
import { SubscriptionRepository } from "../repositories/SubscriptionRepository";

export class SubscriptionService {
    constructor(private repo = new SubscriptionRepository()) { }

    create(data: any) {
        return this.repo.create(data);
    }
    get(id: string) {
        return this.repo.findById(id);
    }
    async list(q?: string, page = 1, limit = 20) {
        const filter = q ? { '': { $regex: q, $options: 'i' } } : {};
        const [items, total] = await Promise.all([this.repo.find(filter, page, limit), this.repo.count(filter)]);
        return { items, total, page, limit };
    }

    async listByClient(clientId: string, status?: string, page = 1, limit = 20) {
        const filter: any = { clientId };

        if (status) {
            if (status === SubscriptionStatus.ACTIVE) {
                filter.$or = [
                    { status: SubscriptionStatus.ACTIVE },
                    { isTrial: true }
                ];
            } else {
                filter.status = status;
            }
        }

        const [items, total] = await Promise.all([
            this.repo.find(filter, page, limit),
            this.repo.count(filter),
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
