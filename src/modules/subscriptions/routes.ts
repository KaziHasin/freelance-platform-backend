
import { Router } from 'express';
import {
    createSubscription, listSubscriptions, listClientSubscriptions, getSubscription, updateSubscription, deleteSubscription,
} from '../subscriptions/controllers/SubscriptionController';
import { authMiddleware } from '@/common/middleware/authMiddleware';
import { authorize } from '@/common/middleware/authorizeMiddleware';
import { Role } from '@/common/types/enums';

const router = Router();


router.post('/subscriptions', authMiddleware, authorize(Role.CLIENT), createSubscription);
router.get('/subscriptions', authMiddleware, authorize(Role.ADMIN), listSubscriptions);
router.get("/subscriptions/client", authMiddleware, authorize(Role.ADMIN, Role.CLIENT), listClientSubscriptions);
router.get('/subscriptions/:id', authMiddleware, authorize(Role.CLIENT), getSubscription);
router.put('/subscriptions/:id', authMiddleware, authorize(Role.CLIENT), updateSubscription);
router.delete('/subscriptions/:id', authMiddleware, authorize(Role.ADMIN), deleteSubscription);


export default router;