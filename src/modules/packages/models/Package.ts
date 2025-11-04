import { PackageCode } from '@/common/types/enums';
import { Schema, model, Document } from 'mongoose';

export type PriceMap = {
    [currencyCode: string]: number;
};

export interface IPackage extends Document {
    code: PackageCode;
    prices: PriceMap;
    projectsPerMonth: number | null;
    contactClicksPerProject: number | null;
    notes?: string;
    shortDescription?: string;
    footerText?: string;
    badge?: string;
    features: string[];
    createdAt: Date;
    updatedAt: Date;
}

const packageSchema = new Schema<IPackage>(
    {
        code: {
            type: String,
            enum: Object.values(PackageCode),
            required: true,
            unique: true,
            index: true,
        },
        prices: {
            type: Map,
            of: { type: Number, min: 0 },
            required: true,
        },
        projectsPerMonth: { type: Number, default: null, min: 0 },
        contactClicksPerProject: { type: Number, default: null, min: 0 },
        notes: { type: String },
        shortDescription: { type: String, default: '' },
        footerText: { type: String, default: '' },
        badge: { type: String, default: '' },
        features: { type: [String], default: [] },
    },
    { timestamps: true }
);

export const Package = model<IPackage>('Package', packageSchema);
