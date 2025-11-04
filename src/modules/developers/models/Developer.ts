import { Schema, model, Document, Types } from 'mongoose';
import { DevLevel, VerificationStatus } from '@/common/types/enums';


export interface IDeveloper extends Document {
    userId: Types.ObjectId;

    verification: {
        docUrl?: string;
        docFile?: string
        idType?: "id-card" | "pan-card" | "passport" | "driving-license";
        status: VerificationStatus;
        reviewedBy?: Types.ObjectId;
        reviewedAt?: Date;
    };

    profile: {
        bio?: string;
        experienceYears?: number;
        skills: Types.ObjectId[];
        linkedin?: string;
        portfolio?: string;
        whatsapp?: string;
    };
    level: DevLevel;
    rating: {
        avg: number;
        count: number;
    };
    assignedCount: number;
    lastAssignedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const developerSchema = new Schema<IDeveloper>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
        verification: {
            docUrl: { type: String },
            docFile: { type: String },
            idType: {
                type: String,
                enum: ["id-card", "pan-card", "passport", "driving-license"],
            },
            status: {
                type: String,
                enum: Object.values(VerificationStatus),
                default: VerificationStatus.PENDING,
            },
            reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
            reviewedAt: { type: Date },
        },
        profile: {
            bio: { type: String },
            experienceYears: { type: Number },
            skills: [{ type: Schema.Types.ObjectId, ref: 'Skill', index: true }],
            linkedin: { type: String },
            portfolio: { type: String },
            whatsapp: { type: String },
        },
        level: {
            type: String,
            required: true,
            index: true,
            enum: Object.values(DevLevel),
            default: DevLevel.FRESHER,
        },
        rating: {
            avg: { type: Number, default: 0 },
            count: { type: Number, default: 0 },
        },
        assignedCount: { type: Number, default: 0 },
        lastAssignedAt: { type: Date },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

developerSchema.virtual("assignments", {
    ref: "Assignment",
    localField: "_id",
    foreignField: "developerId",
});

developerSchema.virtual("notRepliedAssignments", {
    ref: "Assignment",
    localField: "_id",
    foreignField: "triedDeveloperIds",
});

export const Developer = model<IDeveloper>('Developer', developerSchema);
