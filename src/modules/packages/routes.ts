import { Router } from 'express';
import * as PackageController from './controllers/PackageController';
import { Role } from '@/common/types/enums';
import { authorize } from '@/common/middleware/authorizeMiddleware';
import { authMiddleware } from '@/common/middleware/authMiddleware';

const router = Router();

router
    .route('/packages')
    .get(authMiddleware, authorize(Role.ADMIN, Role.CLIENT), PackageController.listPackages)
    .post(authMiddleware, authorize(Role.ADMIN), PackageController.createPackage);

router
    .route('/packages/:id')
    .get(authMiddleware, authorize(Role.ADMIN, Role.CLIENT), PackageController.getPackage)
    .put(authMiddleware, authorize(Role.ADMIN), PackageController.updatePackage)
    .delete(authMiddleware, authorize(Role.ADMIN), PackageController.deletePackage);

export default router;
