import Razorpay from "razorpay";
import { IPaymentProvider } from "./IPaymentProvider";
import { PaymentRequest } from "../PaymentService";


export class RazorpayPayment implements IPaymentProvider {
    private razorpay: Razorpay;

    constructor(keyId: string, keySecret: string) {
        this.razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    }

    async processPayment(req: PaymentRequest) {
        const order = await this.razorpay.orders.create({
            amount: req.amount * 100,
            currency: req.currency,
            receipt: "order_rcptid_" + Date.now(),
        });

        return { status: "success", transactionId: order.id };
    }
}
