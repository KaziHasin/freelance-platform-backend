import type { Request, Response } from 'express';
import { asyncHandler } from '../../../common/utils/asyncHandler';
import { validate } from '../../../common/middleware/validate';
import { CreatePackageDto, UpdatePackageDto, ListQueryDto } from '../dtos/PackageDto';
import { PackageService } from '../services/PackageService';

const service = new PackageService();

export const createPackage = [
    validate(CreatePackageDto),
    asyncHandler(async (req: Request, res: Response) => {
        const created = await service.create(req.body);
        res.status(201).json(created);
    }),
];

export const listPackages = [
    validate(ListQueryDto),
    asyncHandler(async (req: Request, res: Response) => {
        const { page, limit, q } = req.query as any;
        const result = await service.list(q, Number(page), Number(limit));
        res.json(result);
    }),
];

export const getPackage = asyncHandler(async (req: Request, res: Response) => {
    const item = await service.get(req.params.id as string);
    if (!item) return res.status(404).json({ error: 'NotFound', message: 'Package not found' });
    res.json(item);
});

export const updatePackage = [
    validate(UpdatePackageDto),
    asyncHandler(async (req: Request, res: Response) => {
        const updated = await service.update(req.params.id as string, req.body);
        if (!updated) return res.status(404).json({ error: 'NotFound', message: 'Package not found' });
        res.json(updated);
    }),
];

export const deletePackage = asyncHandler(async (req: Request, res: Response) => {
    const deleted = await service.remove(req.params.id as string);
    if (!deleted) return res.status(404).json({ error: 'NotFound', message: 'Package not found' });
    res.status(204).send();
});
