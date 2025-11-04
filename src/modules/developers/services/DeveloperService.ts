import { SkillService } from '@/modules/projects/services/SkillService';
import { DeveloperRepository } from '../repositories/DeveloperRepository';
import { VerificationStatus } from '@/common/types/enums';
import { Types, UpdateQuery } from 'mongoose';
import { IDeveloper } from '../models/Developer';

export class DeveloperService {
    constructor(private repo = new DeveloperRepository(), private skillService = new SkillService()) { }

    async create(data: any) {
        return this.repo.create(data);
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

        const [items, total] = await Promise.all([this.repo.find(filter, page, limit), this.repo.count(filter)]);
        return { items, total, page, limit };
    }
    async update(id: string, data: any, files?: {
        docFile?: Express.Multer.File | undefined;
        idFile?: Express.Multer.File | undefined;
    }) {


        const skills = await this.skillService.resolveSkillIds(data?.profile?.skills || []);

        const existingDeveloper = await this.repo.findDeveloper(id);
        const existingVerification = existingDeveloper?.verification || {};

        let verification: any = { ...existingVerification };

        if (data.verification?.docUrl || files?.docFile) {
            if (files?.docFile) {
                verification.docFile = `/uploads/${files.docFile.filename}`;
                verification.docUrl = undefined;
            } else if (data.verification.docUrl) {
                verification.docUrl = data.verification.docUrl;
                verification.docFile = undefined;
            }
        }

        if (data.verification?.idType || files?.idFile) {
            if (files?.idFile) {
                verification.idType = `/uploads/${files.idFile.filename}`;
            } else if (data.verification.idType) {
                verification.idType = data.verification.idType;
            }
        }

        // Preserve verification status and review info unless explicitly changed
        // if (data.verification?.status) {
        //     verification.status = data.verification.status;
        // }
        // if (data.verification?.reviewedBy) {
        //     verification.reviewedBy = data.verification.reviewedBy;
        // }

        const toUpdate = {
            ...data,
            verification,
            profile: {
                ...existingDeveloper?.profile,
                ...data.profile,
                skills,
            },
        };

        Object.keys(toUpdate).forEach(key => {
            if (toUpdate[key] === undefined) {
                delete toUpdate[key];
            }
        });

        Object.keys(toUpdate.profile).forEach(key => {
            if (toUpdate.profile[key] === undefined) {
                delete toUpdate.profile[key];
            }
        });

        Object.keys(toUpdate.verification).forEach(key => {
            if (toUpdate.verification[key] === undefined) {
                delete toUpdate.verification[key];
            }
        });

        const updated = await this.repo.update(id, toUpdate);
        return updated;
    }


    // async updateVerificationStatus(
    //     id: string,
    //     status: VerificationStatus,
    //     adminId: Types.ObjectId
    // ) {
    //     const update = {
    //         $set: {
    //             "verification.status": status.status,
    //             "verification.reviewedBy": adminId,
    //             "verification.reviewedAt": new Date(),
    //         }
    //     };

    //     return this.repo.update(id, update);
    // }

    async checkProfileCompletion(id: string) {

        const developer = await this.repo.findDeveloper(id);


        if (!developer) {
            return { profileCompleted: false };
        }
        const profile = developer?.profile;

        const isCompleted =
            !!profile &&
            !!profile.bio &&
            !!profile.experienceYears &&
            Array.isArray(profile.skills) &&
            profile.skills.length > 0 &&
            !!profile.linkedin &&
            !!profile.portfolio &&
            !!profile.whatsapp;

        return isCompleted;
    }


    remove(id: string) {
        return this.repo.delete(id);
    }
}
