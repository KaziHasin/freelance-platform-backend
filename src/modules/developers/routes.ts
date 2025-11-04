
import { Router } from 'express';

import {
    createDeveloper, listDevelopers, getDeveloper, updateDeveloper, deleteDeveloper, reviewStatus,
    checkProfileCompletion
} from '../developers/controllers/DeveloperController';
import { authMiddleware } from '@/common/middleware/authMiddleware';
import { authorize } from '@/common/middleware/authorizeMiddleware';
import { Role } from '@/common/types/enums';
import { upload } from '@/common/utils/upload';


const router = Router();


router.post('/developers', authMiddleware, authorize(Role.ADMIN), createDeveloper);
router.get('/developers', authMiddleware, authorize(Role.ADMIN), listDevelopers);
router.get('/developers/:id', authMiddleware, authorize(Role.DEVELOPER), getDeveloper);
router.put(
    "/developers/:id",
    authMiddleware,
    authorize(Role.DEVELOPER),
    upload.fields([
        { name: "docFile", maxCount: 1 },
        { name: "idFile", maxCount: 1 }
    ]),
    updateDeveloper
);
router.patch('/developers/:id/review', authMiddleware, authorize(Role.ADMIN), reviewStatus);
router.get('/developers/profile/completion', authMiddleware, authorize(Role.DEVELOPER), checkProfileCompletion);
router.delete('/developers/:id', authMiddleware, authorize(Role.ADMIN), deleteDeveloper);

export default router;
