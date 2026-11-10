import { NextFunction, Request, Response, Router } from "express";
import {
  getAdminTask,
  updateAdminTaskStatus,
} from "../services/admin.task.service";

export const AdminTaskRouter = Router();

AdminTaskRouter.patch(
  "/:taskId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { taskId } = req.params;
      const status = req.body.status;
      const task = await updateAdminTaskStatus(taskId as string, status);
      res.status(200).json({
        success: true,
        data: {
          task,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

AdminTaskRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query;
      const data = await getAdminTask(req.query);
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },
);
