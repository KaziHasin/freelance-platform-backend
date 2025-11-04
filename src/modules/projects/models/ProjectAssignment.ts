import { Schema, model, Document, Types } from "mongoose";

export interface IProjectAssignment extends Document {
  projectId: Types.ObjectId;
  developerId: Types.ObjectId;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "TIMEOUT";
  assignedAt: Date;
  respondedAt?: Date;
}

const ProjectAssignmentSchema = new Schema<IProjectAssignment>({
  projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  developerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["PENDING", "ACCEPTED", "REJECTED", "TIMEOUT"],
    required: true,
  },
  assignedAt: { type: Date, default: Date.now },
  respondedAt: { type: Date },
});

export default model<IProjectAssignment>(
  "ProjectAssignment",
  ProjectAssignmentSchema
);
