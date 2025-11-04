import { Request, Response } from "express";
import { PaymentService } from "../services/PaymentService";
import { validate } from "@/common/middleware/validate";
import { CheckoutPaymentDto } from "../dtos/PaymentDto";
import { asyncHandler } from "@/common/utils/asyncHandler";

const paymentService = new PaymentService();

export const checkout = [
    validate(CheckoutPaymentDto),
    asyncHandler(async (req: Request, res: Response) => {
        const { paymentMethod, planInterval, amount, currency, clientId, packageId, packageTitle, paymentDetails } = req.body;

        if (!clientId) {
            return res.status(401).json({ error: "Unauthorized User" });
        }

        const result = await paymentService.processPayment({
            paymentMethod,
            planInterval,
            amount,
            currency,
            packageId,
            clientId,
            packageTitle,
            paymentDetails
        });

        res.json(result);

    }),

];
