import { z } from "zod";

export const RoleEnum = z.enum(['CLIENT', 'DEVELOPER', 'ADMIN']);
export const ProviderEnum = z.enum(['local', 'google', 'phone']);
export const StatusEnum = z.enum(['ACTIVE', 'INACTIVE', 'PENDING']);

export const EmailSignupDto = z.object({
    body: z.object({
        name: z.string().min(3, 'Name must be at least 3 characters long').max(25),
        email: z.string().email().optional(),
        phone: z.string().min(6).optional(),
        password: z.string().min(6).optional(),
        provider: ProviderEnum,
        role: RoleEnum.default('ADMIN'),
        status: StatusEnum.default('PENDING'),
    }).refine((data) => data.email || data.phone, {
        message: "Either email or phone is required",
        path: ["email"],
    }),
});


export const EmailLoginDto = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string(),
    })
});

export const PhoneRequestDto = z.object({
    phone: z.string().min(10).max(15),
    role: z.enum(["CLIENT", "DEVELOPER"]).default("CLIENT"),
});

export const PhoneOtpVerifyDto = z.object({
    phone: z.string().min(10).max(15),
    otp: z.string().length(6),
});


export const GoogleAuthDto = z.object({
    token: z.string(),
    role: z.enum(["CLIENT", "DEVELOPER"]).default("CLIENT"),
});




