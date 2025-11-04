import { Request, Response } from 'express';
import { SkillService } from '../services/SkillService';
import { asyncHandler } from '@/common/utils/asyncHandler';
import { StatusCodes } from 'http-status-codes';
import { ListSkillDto } from '../dtos/SkillDto';
import { validate } from '@/common/middleware/validate';



const skillService = new SkillService();


export const resolve = [
    asyncHandler(async (req: Request, res: Response) => {
        const { tags } = req.body as { tags: string[] };
        const ids = await skillService.resolveSkillIds(tags || []);
        res.status(StatusCodes.OK).json({ skillIds: ids });
    }),
];

export const listSkills = [
    validate(ListSkillDto),
    asyncHandler(async (req: Request, res: Response) => {
        const { page, limit, search } = req.query as any;
        const result = await skillService.list(search, Number(page), Number(limit));
        res.json(result);
    }),
];

export const deleteSkill = asyncHandler(async (req: Request, res: Response) => {
    const deleted = await skillService.remove(req.params.id as string);
    if (!deleted) return res.status(404).json({ error: 'Not Found' });
    res.status(204).send();
});

