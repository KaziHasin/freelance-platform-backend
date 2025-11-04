import { FilterQuery } from 'mongoose';
import { Package } from '../models/Package';
import type { IPackage } from '../models/Package';

export class PackageRepository {
    create(data: Partial<IPackage>) {
        return Package.create(data);
    }
    findById(id: string) {
        return Package.findById(id);
    }
    findOne(filter: FilterQuery<IPackage>) {
        return Package.findOne(filter);
    }
    find(filter: FilterQuery<IPackage>, page = 1, limit = 20) {
        return Package.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
    }
    count(filter: FilterQuery<IPackage>) {
        return Package.countDocuments(filter);
    }
    update(id: string, data: Partial<IPackage>) {
        return Package.findByIdAndUpdate(id, data, { new: true });
    }
    delete(id: string) {
        return Package.findByIdAndDelete(id);
    }
}
