
import { Payment } from "../models/Payment";
import type { IPaymentDocument } from "../models/Payment";
export class PaymentRepository {
    async create(data: Partial<IPaymentDocument>) {
        return await Payment.create(data);
    }

    async findById(id: string) {
        return await Payment.findById(id);
    }

    async findAll() {
        return await Payment.find().sort({ createdAt: -1 });
    }
}
