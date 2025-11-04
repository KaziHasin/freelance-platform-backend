
import { SubscriptionStatus } from '@/common/types/enums';
import { Schema, model, Document, Types } from 'mongoose';



export interface ISubscription extends Document {
    clientId: Types.ObjectId;
    packageId: Types.ObjectId;
    paymentId: Types.ObjectId;
    status: SubscriptionStatus;
    startDate: Date;
    endDate?: Date;
    isTrial: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>(
    {
        clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
        packageId: { type: Schema.Types.ObjectId, ref: 'Package', required: true },
        paymentId: { type: Schema.Types.ObjectId, ref: 'Payment', required: true },
        status: { type: String, enum: Object.values(SubscriptionStatus), default: SubscriptionStatus.ACTIVE },
        startDate: { type: Date, default: Date.now },
        endDate: { type: Date },
        isTrial: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const Subscription = model<ISubscription>('Subscription', subscriptionSchema);
