import { z } from "zod";

export const skillTag = z.string().min(1).max(64);

export const CreateProjectDto = z.object({
  body: z.object({
    title: z.string().min(3).max(100),
    description: z.string().min(10),
    requiredSkillIds: z.array(skillTag).min(1).max(5),
    clientId: z.string().length(24),
    // agreementFileUrl: z.string().url().optional(),
  }),
});

export const UpdateProjectDto = z.object({
  params: z.object({ id: z.string().length(24) }),
  body: z
    .object({
      title: z.string().min(3).max(100).optional(),
      description: z.string().min(10).optional(),
      requiredSkillIds: z.array(skillTag).min(1).max(5).optional(),
      // agreementFileUrl: z.string().url().optional(),
    })
    .refine((d) => Object.keys(d).length > 0, {
      message: "No fields to update",
    }),
});

export const ListProjectQueryDto = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20),
    q: z.string().optional(),
  }),
});
