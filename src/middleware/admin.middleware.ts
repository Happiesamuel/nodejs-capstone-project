import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (req.user?.role !== "ADMIN") {
    next(
      new AppError(403, "Admin access required, You do not have permission"),
    );
    return;
  }

  next();
}
