import { Router } from "express";
import { dashboard } from "./controllers/AdminController";
import { authMiddleware } from "@/common/middleware/authMiddleware";
import { authorize } from "@/common/middleware/authorizeMiddleware";
import { Role } from "@/common/types/enums";

const router = Router();

router.get("/dashboard", authMiddleware, authorize(Role.ADMIN), dashboard);

export default router;
