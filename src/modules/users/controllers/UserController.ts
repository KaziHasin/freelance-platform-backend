import { Request, Response } from 'express';
import { asyncHandler } from '../../../common/utils/asyncHandler';
import { validate } from '../../../common/middleware/validate';
import { CreateUserDto, UpdateUserDto, ListQueryDto } from '../dtos/UserDto';
import { UserService } from '../services/UserService';

const service = new UserService();

export const createUser = [
    validate(CreateUserDto),
    asyncHandler(async (req: Request, res: Response) => {
        const created = await service.create(req.body);
        res.status(201).json(created);
    }),
];

export const listUsers = [
    validate(ListQueryDto),
    asyncHandler(async (req: Request, res: Response) => {
        const { page, limit, search, role, status } = req.query as any;
        const result = await service.list(search, role, status, Number(page), Number(limit));
        res.json(result);
    }),
];
export const getUser = asyncHandler(async (req: Request, res: Response) => {
    const item = await service.get(req.params.id as string);
    if (!item) return res.status(404).json({ error: 'Not Found' });
    res.json(item);
});

export const updateUser = [
    validate(UpdateUserDto),
    asyncHandler(async (req: Request, res: Response) => {
        const updated = await service.update(req.params.id as string, req.body);
        if (!updated) return res.status(404).json({ error: 'Not Found' });
        res.json(updated);
    }),
];

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const deleted = await service.remove(req.params.id as string);
    if (!deleted) return res.status(404).json({ error: 'Not Found' });
    res.status(204).send();
});

export const updateStatus = asyncHandler(async (req: Request, res: Response) => {
    const updated = await service.update(req.params.id as string, req.body);
    if (!updated) return res.status(404).json({ error: 'Not Found' });
    res.json(updated);

});
