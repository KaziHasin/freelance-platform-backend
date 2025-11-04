import { z } from "zod";

export const PaymentMethodEnum = z.enum(["paypal", "razorpay", "stripe"]);
export const PlanIntervalEnum = z.enum(["monthly", "yearly"]);
export const CurrencyEnum = z.enum(["INR", "USD", "EUR"]);

export const PaymentDetailsDto = z.object({
    cardNumber: z
        .string()
        .regex(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/, "Card number must be in format: 0000 0000 0000 0000"),

    expiryDate: z
        .string()
        .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry date must be in MM/YY format"),
    cvv: z
        .string()
        .regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
    name: z.string().min(2, "Name on card must be at least 2 characters"),
});

export const CheckoutPaymentDto = z.object({
    body: z.object({
        paymentMethod: PaymentMethodEnum,
        planInterval: PlanIntervalEnum,
        amount: z.number().positive("Amount must be greater than 0"),
        currency: CurrencyEnum,
        clientId: z.string().length(24, "Invalid client ID"),
        packageId: z.string().length(24, "Invalid package ID"),
        packageTitle: z.string().min(3, "Package title must be at least 3 characters"),
        paymentDetails: PaymentDetailsDto,
    }),
});
