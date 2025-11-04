import { asyncHandler } from "@/common/utils/asyncHandler";
import { Request, Response } from "express";
import { AssignmentRotationService } from "../services/AssignmentRotationService";
import { acceptOrRejectAssignmentRequest } from "../dtos/AssignmentRotationDto";
import { validate } from "@/common/middleware/validate";

const assignmentRotationService = new AssignmentRotationService();

export const acceptAssignment = [
    validate(acceptOrRejectAssignmentRequest),
    asyncHandler(async (req: Request, res: Response) => {
        const { projectId, developerId } = req.params;
        const updated = await assignmentRotationService.accept(projectId as string, developerId as string);
        if (!updated) return res.status(404).json({ error: 'Not Found or not pending' });
        res.json(updated);
    }),
]


export const rejectAssignment = [
    validate(acceptOrRejectAssignmentRequest),
    asyncHandler(async (req: Request, res: Response) => {
        const { projectId, developerId } = req.params;
        const updated = await assignmentRotationService.reject(projectId as string, developerId as string);
        if (!updated) return res.status(404).json({ error: 'Not Found or not pending' });
        res.json(updated);
    }),
]