import { z } from "zod";


export const acceptOrRejectAssignmentRequest = z.object({
    params: z.object({
        projectId: z.string().length(24),
        developerId: z.string().length(24),
    }),
});