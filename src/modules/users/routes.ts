import { Router } from 'express';
import {
    createUser, listUsers, getUser, updateUser, deleteUser, updateStatus
} from './controllers/UserController';
import { emailLogin, emailSignup, authMe, googleAuth, requestOtp, verifyPhoneOtp, refreshToken, logout } from './controllers/authController';
import { authMiddleware } from '@/common/middleware/authMiddleware';
import { authorize } from '@/common/middleware/authorizeMiddleware';
import { Role } from '@/common/types/enums';

const router = Router();

router.post('/users', authMiddleware, authorize(Role.ADMIN), createUser);
router.get('/users', authMiddleware, authorize(Role.ADMIN), listUsers);
router.get('/users/:id', authMiddleware, authorize(Role.ADMIN), getUser);
router.put('/users/:id', authMiddleware, authorize(Role.ADMIN), updateUser);
router.delete('/users/:id', authMiddleware, authorize(Role.ADMIN), deleteUser);
router.patch('/users/:id/status', authMiddleware, authorize(Role.ADMIN), updateStatus);

// auth routes 
router.post("/auth/email/signup", emailSignup);
router.post("/auth/email/login", emailLogin);

router.get("/auth/me", authMiddleware, authorize(Role.ADMIN, Role.CLIENT, Role.DEVELOPER), authMe)

router.post("/auth/phone/request-otp", requestOtp);
router.post("/auth/phone/verify-otp", verifyPhoneOtp);

router.post("/auth/google", googleAuth);

router.post('/auth/refresh', refreshToken);

router.post('/auth/logout', authMiddleware, logout);


export default router;
