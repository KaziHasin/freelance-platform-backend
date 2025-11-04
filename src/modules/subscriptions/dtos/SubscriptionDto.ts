import { z } from "zod";
import { SubscriptionStatus } from "@/common/types/enums";
const status = Object.keys(SubscriptionStatus) as [keyof typeof SubscriptionStatus];
export const CreateSubscriptionDto = z.object({
    body: z.object({
        clientId: z.string().length(24),
        packageId: z.string().length(24),
        status: z.nativeEnum(SubscriptionStatus).optional(),
        startDate: z.coerce.date().optional(),
        endDate: z.coerce.date().optional(),
        isTrial: z.boolean().default(false),
    })
});
export const UpdateSubscriptionDto = z.object({
    body: z.object({
        clientId: z.string().length(24),
        packageId: z.string().length(24),
        status: z.enum(status).optional(),
        startDate: z.coerce.date().optional(),
        endDate: z.coerce.date().optional(),
        isTrial: z.boolean().default(false),
    })
});

export const ListQueryDto = z.object({
    query: z.object({
        page: z.coerce.number().min(1).default(1),
        limit: z.coerce.number().min(1).max(100).default(20),
        search: z.string().optional(),
        status: z.enum(status).optional(),
    }).strict(),
});

