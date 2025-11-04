import { Schema, model, Document, Types } from 'mongoose';

export type Role = 'CLIENT' | 'DEVELOPER' | 'ADMIN';
export type Provider = 'local' | 'google' | 'phone';

export interface IUser extends Document {
    _id: Types.ObjectId;
    name: string,
    email?: string;
    phone?: string;
    passwordHash?: string;
    provider: Provider;
    role: Role;
    status: 'ACTIVE' | 'INACTIVE';
    otp?: string | null;
    otpExpiresAt?: Date | null;
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, unique: true, sparse: true },
        phone: { type: String, unique: true, sparse: true },
        passwordHash: { type: String },
        provider: { type: String, enum: ['local', 'google', 'phone'], required: true },
        role: {
            type: String,
            enum: ['CLIENT', 'DEVELOPER', 'ADMIN'],
            default: 'CLIENT',
        },
        status: {
            type: String,
            enum: ['ACTIVE', 'INACTIVE'],
            default: 'ACTIVE',
        },
        lastLoginAt: { type: Date },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

userSchema.virtual('client', {
    ref: 'Client',
    localField: '_id',
    foreignField: 'userId',
    justOne: true,
});

userSchema.virtual('developer', {
    ref: 'Developer',
    localField: '_id',
    foreignField: 'userId',
    justOne: true,
});

userSchema.virtual("avatar").get(function (this: IUser) {
    const encodedName = encodeURIComponent(this.name || "U");
    return `https://avatar.iran.liara.run/username?username=${encodedName}&background=b9d7f9&color=1478eb`;
});


export const User = model<IUser>('User', userSchema);
