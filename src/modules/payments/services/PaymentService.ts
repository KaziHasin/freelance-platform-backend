
import { IPaymentProvider } from "./providers/IPaymentProvider";
import { StripePayment } from "./providers/StripePayment";
import { RazorpayPayment } from "./providers/RazorpayPayment";
import { PaypalPayment } from "./providers/PaypalPayment";
import { PaymentRepository } from "../repositories/PaymentRepository";
import { SubscriptionRepository } from "@/modules/subscriptions/repositories/SubscriptionRepository";
import { Types } from 'mongoose';
import { SubscriptionStatus } from "@/common/types/enums";
import { addMonths, addYears, isAfter } from "date-fns";

export interface PaymentRequest {
    paymentMethod: "paypal" | "razorpay" | "stripe";
    planInterval: "monthly" | "yearly";
    amount: number;
    currency: string;
    clientId: string;
    packageId: string;
    packageTitle: string;
    paymentDetails?: any;
}


export class PaymentService {
    private providers: Record<string, IPaymentProvider>
    constructor(private paymentRepo = new PaymentRepository(), private subscriptionRepo = new SubscriptionRepository()) {

        this.providers = {
            stripe: new StripePayment(process.env.STRIPE_SECRET!),
            // razorpay: new RazorpayPayment(process.env.RAZORPAY_KEY!, process.env.RAZORPAY_SECRET!),
            // paypal: new PaypalPayment(process.env.PAYPAL_CLIENT_ID!, process.env.PAYPAL_SECRET!),
        };
    }

    async processPayment(req: PaymentRequest) {
        const provider = this.providers[req.paymentMethod];
        if (!provider) throw new Error("Unsupported payment method");

        const result = await provider.processPayment(req);

        const payment = await this.recordPayment(req, result);

        await this.handleSubscription(req, payment._id);

        return result;
    }



    /** Save payment details in DB */
    private async recordPayment(req: PaymentRequest, result: any) {
        return this.paymentRepo.create({
            ...req,
            transactionId: result.transactionId,
            status: result.status === "success" ? "success" : "failure",
        });
    }

    /** Create or schedule subscription */
    private async handleSubscription(req: PaymentRequest, paymentId: any) {
        const [startDate, status] = await this.determineStartDate(req.clientId);
        const endDate = this.calculateEndDate(startDate, req.planInterval);

        const subscription = await this.subscriptionRepo.create({
            clientId: new Types.ObjectId(req.clientId),
            packageId: new Types.ObjectId(req.packageId),
            paymentId: new Types.ObjectId(paymentId),
            status,
            startDate,
            endDate,
            isTrial: false,
        });

        await subscription.save();
    }

    /** Check existing active subscription and return correct start date */
    private async determineStartDate(clientId: string): Promise<[Date, SubscriptionStatus]> {
        const existingSubscription = await this.subscriptionRepo.findOne(
            {
                clientId: new Types.ObjectId(clientId),
                isTrial: false,
                status: SubscriptionStatus.ACTIVE,
                endDate: { $gte: new Date() },
            },
            { endDate: -1 }
        );

        if (
            existingSubscription?.endDate &&
            isAfter(existingSubscription.endDate, new Date())
        ) {
            const nextDay = new Date(existingSubscription.endDate);
            nextDay.setDate(nextDay.getDate() + 1);
            return [nextDay, SubscriptionStatus.SCHEDULED];
        }

        return [new Date(), SubscriptionStatus.ACTIVE];
    }

    private calculateEndDate(startDate: Date, planInterval: "monthly" | "yearly"): Date {
        return planInterval === "monthly"
            ? addMonths(startDate, 1)
            : addYears(startDate, 1);
    }




}
