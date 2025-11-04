import { PaymentRequest } from "../PaymentService";

export interface IPaymentProvider {
    processPayment(req: PaymentRequest): Promise<{ status: string; transactionId: string }>;
}
