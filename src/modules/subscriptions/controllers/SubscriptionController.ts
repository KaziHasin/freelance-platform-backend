import { Request, Response } from 'express';
import { asyncHandler } from '../../../common/utils/asyncHandler';
import { validate } from '../../../common/middleware/validate';
import { SubscriptionService } from '../services/SubscriptionService';
import { CreateSubscriptionDto, ListQueryDto, UpdateSubscriptionDto } from '../dtos/SubscriptionDto';

const service = new SubscriptionService();

export const createSubscription = [

    validate(CreateSubscriptionDto),
    asyncHandler(async (req: Request, res: Response) => {
        const created = await service.create(req.body);
        res.status(201).json(created);
    }),
];

export const listSubscriptions = [
    validate(ListQueryDto),
    asyncHandler(async (req: Request, res: Response) => {
        const { page, limit, q } = req.query as any;
        const result = await service.list(q, Number(page), Number(limit));
        res.json(result);
    }),
];

export const listClientSubscriptions = [
    validate(ListQueryDto),
    asyncHandler(async (req: Request, res: Response) => {
        const clientId = req.user?.id;
        const { page, limit, status } = req.query as any;
        if (!clientId) return res.status(400).json({ error: 'Client ID is required' });
        const result = await service.listByClient(clientId, status, Number(page), Number(limit));
        res.json(result);
    }),
];


export const getSubscription = asyncHandler(async (req: Request, res: Response) => {
    const item = await service.get(req.params.id as string);
    if (!item) return res.status(404).json({ error: 'Not Found' });
    res.json(item);
});

export const updateSubscription = [
    validate(UpdateSubscriptionDto),
    asyncHandler(async (req: Request, res: Response) => {
        const updated = await service.update(req.params.id as string, req.body);
        if (!updated) return res.status(404).json({ error: 'Not Found' });
        res.json(updated);
    }),
];

export const deleteSubscription = asyncHandler(async (req: Request, res: Response) => {
    const deleted = await service.remove(req.params.id as string);
    if (!deleted) return res.status(404).json({ error: 'Not Found' });
    res.status(204).send();
});
