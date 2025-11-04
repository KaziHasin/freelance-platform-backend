import { Request, Response } from 'express';
import { asyncHandler } from '../../../common/utils/asyncHandler';
import { validate } from '../../../common/middleware/validate';
import { CreateDeveloperDto, UpdateDeveloperDto, ListQueryDto } from '../dtos/DeveloperDto';
import { DeveloperService } from '../services/DeveloperService';
import { Types } from 'mongoose';
import { UpdateUserDto } from '@/modules/users/dtos/UserDto';
import { UserService } from '@/modules/users/services/UserService';
import { upload } from '@/common/utils/upload';

const service = new DeveloperService();
const userService = new UserService();

export const createDeveloper = [
    validate(CreateDeveloperDto),
    asyncHandler(async (req: Request, res: Response) => {
        const created = await service.create(req.body);
        res.status(201).json(created);
    }),
];

export const listDevelopers = [
    validate(ListQueryDto),
    asyncHandler(async (req: Request, res: Response) => {
        const { page, limit, search, status } = req.query as any;
        const result = await service.list(search, status, Number(page), Number(limit));
        res.json(result);
    }),
];

export const getDeveloper = asyncHandler(async (req: Request, res: Response) => {
    const item = await service.get(req.params.id as string);
    if (!item) return res.status(404).json({ error: 'Not Found' });
    res.json(item);
});

export const updateDeveloper = [
    validate(UpdateDeveloperDto),
    validate(UpdateUserDto),

    asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const { id } = req.params;

        let bodyData = { ...req.body };

        if (typeof bodyData.skills === 'string') {
            try {
                bodyData.skills = JSON.parse(bodyData.skills);
            } catch (error) {
                bodyData.skills = [];
            }
        }

        const { name, email, phone, verification, profile } = bodyData;

        const userData = {
            name,
            email,
            phone
        };

        const data = {
            verification,
            profile

        }

        await userService.update(req.user.id, userData);

        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        const docFile = files?.docFile?.[0];
        const idFile = files?.idFile?.[0];

        const updatedDeveloper = await service.update(
            id as string,
            data,
            { docFile, idFile }
        );

        res.json({
            success: true,
            data: updatedDeveloper,
            message: "Developer profile updated successfully"
        });
    }),
];

export const deleteDeveloper = asyncHandler(async (req: Request, res: Response) => {
    const deleted = await service.remove(req.params.id as string);
    if (!deleted) return res.status(404).json({ error: 'Not Found' });
    res.status(204).send();
});

export const reviewStatus = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const adminId = new Types.ObjectId(req.user.id);
    const updated = await service.updateVerificationStatus(req.params.id as string, req.body, adminId);
    if (!updated) return res.status(404).json({ error: 'Not Found' });
    res.json(updated);
});

export const checkProfileCompletion = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const result = await service.checkProfileCompletion(req.user.id);
    res.json(result);
});

