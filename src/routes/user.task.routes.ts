import { NextFunction, Request, Response, Router } from "express";
import {
  createUserTask,
  deleteUserTask,
  geteUserTask,
  getUserTaskById,
  updateUserTask,
} from "../services/user.task.service";

export const userTaskRouter = Router();

userTaskRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const task = await createUserTask(req.user!.userId, req.body.title);
      res.status(201).json({
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

userTaskRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tasks = await geteUserTask(req.user!.userId);
      res.status(200).json({
        success: true,
        data: {
          tasks,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);
userTaskRouter.get(
  "/:taskId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { taskId } = req.params;
      const task = await getUserTaskById(req.user!.userId, taskId as string);
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
userTaskRouter.patch(
  "/:taskId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { taskId } = req.params;
      const title = req.body.title;
      const task = await updateUserTask(
        req.user!.userId,
        taskId as string,
        title,
      );
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
userTaskRouter.delete(
  "/:taskId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { taskId } = req.params;
      await deleteUserTask(req.user!.userId, taskId as string);
      res.status(200).json({
        success: true,
        message: "Task deleted successfully fromDB",
      });
    } catch (error) {
      next(error);
    }
  },
);
