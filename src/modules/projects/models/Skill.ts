import { Schema, model, Types } from 'mongoose';

export interface ISkill {
    _id: Types.ObjectId;
    name: string;
    label: string;
    createdAt: Date;
    updatedAt: Date;
}


const skillSchema = new Schema<ISkill>({
    name: { type: String, required: true, unique: true, index: true },
    label: { type: String, required: true, unique: true },
}, { timestamps: true });

export const Skill = model<ISkill>('Skill', skillSchema);