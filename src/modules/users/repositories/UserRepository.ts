import { FilterQuery } from 'mongoose';
import { User } from '../models/User';
import type { IUser } from '../models/User';

export class UserRepository {
    create(data: Partial<IUser>) {
        return User.create(data);
    }
    findById(id: string) {
        return User.findById(id);
    }
    findOne(filter: FilterQuery<IUser>) {
        return User.findOne(filter);
    }
    findByEmail(email: string) {
        return User.findOne({ email });
    }
    findByPhone(phone: string) {
        return User.findOne({ phone });
    }
    find(filter: any, page = 1, limit = 20) {
        return User.find(filter).skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 });
    }
    count(filter: any) {
        return User.countDocuments(filter);
    }
    update(id: string, data: Partial<IUser>) {
        return User.findByIdAndUpdate(id, data, { new: true });
    }
    delete(id: string) {
        return User.findByIdAndDelete(id);
    }
}
