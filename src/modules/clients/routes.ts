
import { Router } from 'express';

import {
    createClient, listClients, getClient, updateClient, deleteClient,
} from '../clients/controllers/ClientController';
import { Role } from '@/common/types/enums';
import { authorize } from '@/common/middleware/authorizeMiddleware';
import { authMiddleware } from '@/common/middleware/authMiddleware';

const router = Router();

router.post('/clients', authMiddleware, authorize(Role.ADMIN), createClient);
router.get('/clients', authMiddleware, authorize(Role.ADMIN), listClients);
router.get('/clients/:id', authMiddleware, authorize(Role.CLIENT), getClient);
router.put('/clients/:id', authMiddleware, authorize(Role.ADMIN), updateClient);
router.delete('/clients/:id', authMiddleware, authorize(Role.ADMIN), deleteClient);

export default router;