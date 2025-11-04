import { z } from 'zod';
import is from 'zod/v4/locales/is.cjs';
export const VerificationStatusEnum = z.enum(['PENDING', 'APPROVED', 'REJECTED']);
export const CreateClientDto = z.object({
    body: z.object({
        userId: z.string().length(24),
        freeTrialUsed: z.boolean().default(false),
        verification: z
            .object({
                status: VerificationStatusEnum.default('PENDING'),
                reviewedBy: z.string().length(24).optional(),
            })
            .default({ status: 'PENDING' }),
    }),
});

export const UpdateClientDto = z.object({
    params: z.object({ id: z.string().length(24) }),
    body: z.object({
        freeTrialUsed: z.boolean().optional(),
        contactClickUsage: z
            .array(z.object({ projectId: z.string().length(24), clicks: z.number().int().min(0) }))
            .optional(),
    }),
});

export const ListQueryDto = z.object({
    query: z.object({
        page: z.coerce.number().min(1).default(1),
        limit: z.coerce.number().min(1).max(100).default(20),
        search: z.string().optional(),
        status: z
            .string()
            .optional()
            .transform((val) => val?.toUpperCase())
            .refine((val) => !val || ['ACTIVE', 'INACTIVE'].includes(val), {
                message: 'Invalid status',
            }),
    }),
});
