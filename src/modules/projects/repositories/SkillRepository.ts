import { ISkill, Skill } from '../models/Skill';
import { FilterQuery } from "mongoose";

export class SkillRepository {

    create(data: Partial<ISkill>) {
        return Skill.create(data);
    }

    createMany(data: Partial<ISkill>[]) {
        return Skill.insertMany(data);
    }

    findByNamesLower(namesLower: string[]) {
        return Skill.find({ name: { $in: namesLower } }).lean();

    }

    find(filter: FilterQuery<ISkill>, page = 1, limit = 20) {
        return Skill.find(filter).skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 });
    }

    count(filter: FilterQuery<ISkill>) {
        return Skill.countDocuments(filter);
    }
    delete(id: string) {
        return Skill.findByIdAndDelete(id);
    }
}