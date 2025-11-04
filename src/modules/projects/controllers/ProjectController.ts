import { Request, Response } from "express";
import { asyncHandler } from "../../../common/utils/asyncHandler";
import { validate } from "../../../common/middleware/validate";
import {
  CreateProjectDto,
  UpdateProjectDto,
  ListProjectQueryDto,
} from "../dtos/ProjectDto";
import { ProjectService } from "../services/ProjectService";
import { upload } from "@/common/utils/upload";

const service = new ProjectService();

export const createProject = [
  upload.single("agreementFileUrl"),
  validate(CreateProjectDto),
  asyncHandler(async (req: Request, res: Response) => {
    console.log("REQ.BODY:", req.body); return;

    const created = await service.createProject(req.body, req.file);
    res.status(201).json(created);
  }),
];

export const listProjects = [
  validate(ListProjectQueryDto),
  asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, q } = req.query as any;
    const result = await service.listProjects(q, Number(page), Number(limit));
    res.json(result);
  }),
];

export const getProject = asyncHandler(async (req: Request, res: Response) => {
  const item = await service.getProject(req.params.id as string);
  if (!item) return res.status(404).json({ error: "Not Found" });
  res.json(item);
});

export const updateProject = [
  validate(UpdateProjectDto),
  asyncHandler(async (req: Request, res: Response) => {
    const updated = await service.updateProject(
      req.params.id as string,
      req.body
    );
    if (!updated) return res.status(404).json({ error: "Not Found" });
    res.json(updated);
  }),
];

export const deleteProject = asyncHandler(
  async (req: Request, res: Response) => {
    const deleted = await service.deleteProject(req.params.id as string);
    if (!deleted) return res.status(404).json({ error: "Not Found" });
    res.status(204).send();
  }
);

