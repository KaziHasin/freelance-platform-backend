import { Request, Response } from 'express';
import { asyncHandler } from '../../../common/utils/asyncHandler';
import { validate } from '../../../common/middleware/validate';
import { CreateClientDto, UpdateClientDto, ListQueryDto } from '../dtos/ClientDto';
import { ClientService } from '../services/ClientService';

const service = new ClientService();

export const createClient = [
    validate(CreateClientDto),
    asyncHandler(async (req: Request, res: Response) => {
        const created = await service.create(req.body);
        res.status(201).json(created);
    }),
];

export const listClients = [
    validate(ListQueryDto),
    asyncHandler(async (req: Request, res: Response) => {
        const { page, limit, search, status } = req.query as any;
        const result = await service.list(search, status, Number(page), Number(limit));
        res.json(result);
    }),
];

export const getClient = asyncHandler(async (req: Request, res: Response) => {
    const item = await service.get(req.params.id as string);
    if (!item) return res.status(404).json({ error: 'Not Found' });
    res.json(item);
});

export const updateClient = [
    validate(UpdateClientDto),
    asyncHandler(async (req: Request, res: Response) => {
        const updated = await service.update(req.params.id as string, req.body);
        if (!updated) return res.status(404).json({ error: 'Not Found' });
        res.json(updated);
    }),
];

export const deleteClient = asyncHandler(async (req: Request, res: Response) => {
    const deleted = await service.remove(req.params.id as string);
    if (!deleted) return res.status(404).json({ error: 'Not Found' });
    res.status(204).send();
});
