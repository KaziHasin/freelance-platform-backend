import { Request, Response } from "express";
import { asyncHandler } from "../../../common/utils/asyncHandler";
import { AdminService } from "../services/AdminService";

const service = new AdminService();

export const dashboard = asyncHandler(async (req: Request, res: Response) => {
    const data = await service.getDashboard();
    res.json(data);
});

