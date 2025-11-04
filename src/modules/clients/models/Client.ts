import { VerificationStatus } from '@/common/types/enums';
import { Schema, model, Document, Types } from 'mongoose';

export interface IClient extends Document {
    userId: Types.ObjectId;
    freeTrialUsed: boolean;
    contactClickUsage: {
        projectId: Types.ObjectId;
        clicks: number;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

const clientSchema = new Schema<IClient>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
        freeTrialUsed: { type: Boolean, default: false },
        contactClickUsage: [
            {
                projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
                clicks: { type: Number, default: 0 },
            },
        ],
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

clientSchema.virtual("subscriptions", {
    ref: "Subscription",
    localField: "_id",
    foreignField: "clientId"
});

clientSchema.virtual("projects", {
    ref: "Project",
    localField: "_id",
    foreignField: "clientId",
});

export const Client = model<IClient>('Client', clientSchema);
