import Stripe from "stripe";
import { IPaymentProvider } from "./IPaymentProvider";
import { PaymentRequest } from "../PaymentService";

export class StripePayment implements IPaymentProvider {
    private stripe: Stripe;

    constructor(secret: string) {
        this.stripe = new Stripe(secret, {
            apiVersion: "2025-08-27.basil",
        });
    }

    async processPayment(req: PaymentRequest) {
        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: Math.round(req.amount * 100),
            currency: req.currency.toLowerCase(),
            description: `${req.packageTitle} - ${req.planInterval}`,
        });

        return { status: "success", transactionId: paymentIntent.id };
    }
}
