import { DevLevel } from "@/common/types/enums";
import { Schema, model, Document, Types } from "mongoose";

export interface IProject extends Document {
  title: string;
  description: string;
  requiredSkillIds: Types.ObjectId[]
  clientId: Types.ObjectId;
  preferredLevel?: DevLevel;
  agreementFileUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    requiredSkillIds: [{ type: Schema.Types.ObjectId, ref: 'Skill', index: true }],
    clientId: { type: Schema.Types.ObjectId, ref: "Client", required: true },
    preferredLevel: { type: String, enum: Object.values(DevLevel), required: false },
    agreementFileUrl: { type: String },
  },
  { timestamps: true }
);

export const Project = model<IProject>('Project', projectSchema);
