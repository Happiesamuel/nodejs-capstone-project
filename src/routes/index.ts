import { Router } from "express";
import { healthRouter } from "./health.routes";
import { authRouter } from "./auth.routes";
import { authenticate } from "../middleware/auth.middleware";
import { userTaskRouter } from "./user.task.routes";
import { AdminTaskRouter } from "./admin.task.routes";
import { requireAdmin } from "../middleware/admin.middleware";
import { adminBannerRouter } from "./admin.banner.routes";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);

apiRouter.use("/auth", authRouter);

apiRouter.use("/tasks", authenticate, userTaskRouter);

apiRouter.use("/admin/tasks", authenticate, requireAdmin, AdminTaskRouter);

apiRouter.use("/admin/banners", authenticate, requireAdmin, adminBannerRouter);
