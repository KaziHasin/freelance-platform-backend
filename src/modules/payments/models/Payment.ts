import { Schema, model, Document } from "mongoose";

export interface IPaymentDocument extends Document {
    paymentMethod: "paypal" | "razorpay" | "stripe";
    planInterval: "monthly" | "yearly";
    amount: number;
    currency: string;
    packageTitle: string;
    transactionId: string;
    status: "success" | "failure";
    createdAt: Date;
}

const PaymentSchema = new Schema<IPaymentDocument>({
    paymentMethod: { type: String, required: true },
    planInterval: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    packageTitle: { type: String, required: true },
    transactionId: { type: String, required: true },
    status: { type: String, enum: ["success", "failure"], required: true },
    createdAt: { type: Date, default: Date.now }
});

export const Payment = model<IPaymentDocument>("Payment", PaymentSchema);
