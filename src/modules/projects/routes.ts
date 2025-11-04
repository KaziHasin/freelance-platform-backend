import { Router } from "express";
import {
  createProject,
  listProjects,
  getProject,
  updateProject,
  deleteProject
} from "./controllers/ProjectController";
import { deleteSkill, listSkills, resolve } from "./controllers/SkillController";
import { authMiddleware } from "@/common/middleware/authMiddleware";
import { authorize } from "@/common/middleware/authorizeMiddleware";
import { Role } from "@/common/types/enums";
import { acceptAssignment, rejectAssignment } from "./controllers/AssignmentRotationController";
import { upload } from "@/common/utils/upload";

const router = Router();

// projects routes
router.post("/projects", authMiddleware, authorize(Role.CLIENT), createProject);
router.get("/projects", authMiddleware, authorize(Role.CLIENT), listProjects);
router.get("/projects/:id", getProject);
router.put("/projects/:id", authMiddleware, authorize(Role.CLIENT), updateProject);
router.delete("/projects/:id", authMiddleware, authorize(Role.ADMIN), deleteProject);


// Skills routes
router.post('/skills/resolve', authMiddleware, resolve);
router.delete('/skills/:id', authMiddleware, authorize(Role.ADMIN), deleteSkill);
router.get('/skills', authMiddleware, listSkills);



// Assignment routes
router.get('/assignments/approve/:projectId/:developerId', authMiddleware, authorize(Role.DEVELOPER), acceptAssignment);
router.get('/assignments/reject/:projectId/:developerId', authMiddleware, authorize(Role.DEVELOPER), rejectAssignment);

export default router;
