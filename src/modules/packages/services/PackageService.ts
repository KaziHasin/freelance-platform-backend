import { PackageRepository } from '../repositories/PackageRepository';

export class PackageService {
    constructor(private repo = new PackageRepository()) { }

    async create(data: any) {
        const existing = await this.repo.findOne({ code: data.code });
        if (existing) {
            const err: any = new Error('Code already exists');
            err.field = 'code';
            throw err;
        }
        return this.repo.create(data);
    }

    get(id: string) {
        return this.repo.findById(id);
    }

    async list(q?: string, page = 1, limit = 20) {
        const filter = q
            ? { $or: [{ code: new RegExp(q, 'i') }, { notes: new RegExp(q, 'i') }] }
            : {};
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
