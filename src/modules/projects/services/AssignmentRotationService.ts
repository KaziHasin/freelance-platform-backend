import { AssignmentStatus } from '@/common/types/enums';
import { Assignment } from '../models/Assignment';
import { SkillMatchingService } from './SkillMatchingService';
import { Developer } from '@/modules/developers/models/Developer';
import { ProjectRepository } from '../repositories/ProjectRepository';

export class AssignmentRotationService {
    constructor(private skillMatching = new SkillMatchingService(), private projectRepo = new ProjectRepository()) { }
    private ROTATION_WINDOW_MS = 15 * 60 * 1000; // 15 minutes


    // Assign next candidate for a project, skipping tried developers
    async assignOrRotate(projectId: string, requiredSkillIds: string[], preferredLevel?: string) {
        const last = await Assignment.findOne({ projectId }).sort({ createdAt: -1 }).lean();
        const tried = last ? [last.developerId.toString(), ...(last.triedDeveloperIds?.map(id => id.toString()) || [])] : [];


        const candidates = await this.skillMatching.getOrderedCandidates(requiredSkillIds, preferredLevel as any, tried);

        if (!candidates.length) return null;


        const dev = candidates[0];


        const assignment = await Assignment.create({
            projectId,
            developerId: dev._id,
            status: AssignmentStatus.PENDING,
            assignedAt: new Date(),
            triedDeveloperIds: tried,
        });


        // Update developer load metrics
        await Developer.updateOne({ _id: dev._id }, {
            $inc: { assignedCount: 1 },
            $set: { lastAssignedAt: new Date() },
        });


        return assignment;
    }


    async accept(projectId: string, developerId: string) {
        const doc = await Assignment.findOneAndUpdate(
            { projectId, developerId, status: AssignmentStatus.PENDING },
            { $set: { status: AssignmentStatus.ACCEPTED, respondedAt: new Date() } },
            { new: true }
        );
        return doc;
    }


    async reject(projectId: string, developerId: string) {
        const doc = await Assignment.findOneAndUpdate(
            { projectId, developerId, status: AssignmentStatus.PENDING },
            { $set: { status: AssignmentStatus.REJECTED, respondedAt: new Date() } },
            { new: true }
        );
        await this.assignOrRotate(projectId.toString(), await this.getProjectSkillIds(projectId.toString()), await this.getProjectPreferredLevel(projectId.toString()));
        return doc;
    }


    // Called by cron: find PENDING >15 min old and rotate to next candidate
    async cronRotateExpired() {
        const threshold = new Date(Date.now() - this.ROTATION_WINDOW_MS);
        const pendings = await Assignment.find({ status: AssignmentStatus.PENDING, assignedAt: { $lte: threshold } }).lean();

        for (const pending of pendings) {
            // mark expired and try next
            await Assignment.updateOne({ _id: pending._id }, { $set: { status: AssignmentStatus.EXPIRED, respondedAt: new Date() } });
            await this.assignOrRotate(pending.projectId.toString(), await this.getProjectSkillIds(pending.projectId.toString()), await this.getProjectPreferredLevel(pending.projectId.toString()));

        }
    }


    private async getProjectSkillIds(projectId: string) {
        const project = await this.projectRepo.findById(projectId).lean();
        return (project?.requiredSkillIds || []).map(x => x.toString());
    }


    private async getProjectPreferredLevel(projectId: string) {
        const project = await this.projectRepo.findById(projectId).lean();
        return project?.preferredLevel as any;
    }
}