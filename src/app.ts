import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import usersRoutes from "./modules/users/routes";
import clientRoutes from "./modules/clients/routes";
import developerRoutes from "./modules/developers/routes";
import subscriptionRoutes from "./modules/subscriptions/routes";
import projectRoutes from "./modules/projects/routes";
import packagesRoutes from './modules/packages/routes';
import paymentRoutes from "./modules/payments/routes";
import { errorMiddleware } from "./common/middleware/errorMiddleware";
import path from "path";

const app = express();


app.use(helmet());
app.use(cors());


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cookieParser());


// --- Health Check ---
app.get("/healthz", (_req, res) => res.json({ status: "ok" }));

app.use("/api/v1", usersRoutes);
app.use("/api/v1", clientRoutes);
app.use("/api/v1", developerRoutes);
app.use('/api/v1', packagesRoutes);
app.use('/api/v1', subscriptionRoutes);
app.use("/api/v1", projectRoutes);
app.use("/api/v1", paymentRoutes);


app.use(errorMiddleware);


export default app;
