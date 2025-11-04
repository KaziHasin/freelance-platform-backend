import { DevLevel } from '@/common/types/enums';
import { Developer } from '../models/Developer';
import type { IDeveloper } from '../models/Developer';
import { Types } from 'mongoose';
import { User } from '@/modules/users/models/User';

export class DeveloperRepository {
    create(data: Partial<IDeveloper>) {
        return Developer.create(data);
    }
    findById(id: string) {
        return User.findById(id)
            .populate({
                path: "developer",
                populate: [
                    {
                        path: "assignments",
                        populate: { path: "projectId", select: "title description createdAt" }
                    },
                    {
                        path: "notRepliedAssignments",
                        populate: { path: "projectId" }
                    },
                    {
                        path: "verification.reviewedBy",
                        select: "name avatar email"
                    },
                    {
                        path: "profile.skills",
                        select: "name label"
                    }
                ]
            });
    }
    find(filter: any, page = 1, limit = 20) {
        return User.find({ ...filter, role: "DEVELOPER" })
            .select("name email phone status provider createdAt")
            .populate({
                path: "developer",
            })
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });
    }
    count(filter: any) {
        return Developer.countDocuments(filter);
    }
    update(id: string, data: any) {
        return Developer.findByIdAndUpdate(id, data, { new: true });
    }
    delete(id: string) {
        return Developer.findByIdAndDelete(id);
    }

    /**
     * Find candidate developers based on required skills and level
     */
    async candidates(
        requiredSkillIds: string[],
        level?: DevLevel,
        excludeIds: string[] = []
    ) {
        const match: any = {
            _id: { $nin: excludeIds.map(id => new Types.ObjectId(id)) },
        };

        if (level) {
            match.level = level;
        }

        const skillObjectIds = requiredSkillIds.map(id => new Types.ObjectId(id));

        return Developer.aggregate([
            { $match: match },
            {
                $addFields: {
                    matchedSkills: {
                        $size: { $setIntersection: ["$profile.skills", skillObjectIds] },
                    },
                },
            },
            { $match: { matchedSkills: { $gt: 0 } } },
            { $sort: { matchedSkills: -1, createdAt: -1 } },
        ]);
    }

    async findDeveloper(id: string): Promise<IDeveloper | null> {
        return Developer.findById(id);
    }

}
