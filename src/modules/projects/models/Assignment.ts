import { AssignmentStatus } from '@/common/types/enums';
import { Schema, model, Types } from 'mongoose';


export interface IAssignment {
    _id: Types.ObjectId;
    projectId: Types.ObjectId;
    developerId: Types.ObjectId;
    status: AssignmentStatus;
    assignedAt: Date; // for 15-min timeout
    respondedAt?: Date;
    triedDeveloperIds: Types.ObjectId[];
}


const assignmentSchema = new Schema<IAssignment>({
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', index: true, required: true },
    developerId: { type: Schema.Types.ObjectId, ref: 'Developer', index: true, required: true },
    status: { type: String, enum: Object.values(AssignmentStatus), index: true, required: true },
    assignedAt: { type: Date, index: true, required: true },
    respondedAt: { type: Date },
    triedDeveloperIds: [{ type: Schema.Types.ObjectId, ref: 'Developer' }],
}, { timestamps: true });


export const Assignment = model<IAssignment>('Assignment', assignmentSchema);