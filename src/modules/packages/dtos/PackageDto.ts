import { PackageCode } from '@/common/types/enums';
import { z } from 'zod';

const PricesSchema = z.record(
    z.string().regex(/^[A-Z]{3}$/, 'Currency code must be 3 uppercase letters (e.g. USD, INR)'),
    z.number().min(0, 'Price must be ≥ 0')
);

const PositiveUnlimitedNumber = z
    .union([
        z.number().gt(0, { message: 'Value must be greater than 0' }),
        z.string().transform((v) => (v?.toUpperCase() === 'UNLIMITED' ? 'UNLIMITED' : v)),
        z.null(),
    ])
    .refine((v) => typeof v === 'number' || v === 'UNLIMITED' || v === null, {
        message: 'Must be a positive number, "UNLIMITED", or null',
    })
    .transform((v) => (v === 'UNLIMITED' ? null : v as number | null));


const PackageBaseSchema = {
    code: z.nativeEnum(PackageCode),
    prices: PricesSchema,
    projectsPerMonth: PositiveUnlimitedNumber,
    contactClicksPerProject: PositiveUnlimitedNumber,
    shortDescription: z.string().min(1, 'Short description is required').max(50, 'No more than 50 characters are allowed'),
    footerText: z.string().min(1, 'Footer text is required').max(50, 'No more than 50 characters are allowed'),
    badge: z.string().max(15, 'No more than 15 characters are allowed').optional(),
    features: z
        .array(z.string().min(1, 'Feature cannot be empty'))
        .min(1, 'At least one feature is required')
        .max(8, 'No more than 6 features are allowed'),
    notes: z.string().max(1500).optional(),
};

export const CreatePackageDto = z.object({
    body: z.object(PackageBaseSchema),
});

export const UpdatePackageDto = z.object({
    params: z.object({ id: z.string().length(24, 'Invalid id') }),
    body: z
        .object({
            ...PackageBaseSchema,
            prices: PricesSchema.optional(),
        })
        .partial()
        .refine((v) => Object.keys(v).length > 0, {
            message: 'No fields to update',
        }),
});

export const ListQueryDto = z.object({
    query: z.object({
        page: z.coerce.number().min(1).default(1),
        limit: z.coerce.number().min(1).max(100).default(20),
        q: z.string().optional(),
    }),
});
