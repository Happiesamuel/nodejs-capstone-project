import { NextFunction, Request, Response, Router } from "express";
import {
  createAdminBannerService,
  deleteAdminBannerService,
  fetchAdminBanners,
} from "../services/admin.banner.service";
import { uploadSingleBannerImage } from "../middleware/banner.middleware";

export const adminBannerRouter = Router();

adminBannerRouter.post(
  "/",
  uploadSingleBannerImage,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const banner = await createAdminBannerService(req.file);

      res.status(201).json({
        success: true,
        date: { banner },
      });
    } catch (error) {
      next(error);
    }
  },
);

adminBannerRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const banners = await fetchAdminBanners();
      res.status(200).json({
        success: true,
        date: { banners },
      });
    } catch (error) {
      next(error);
    }
  },
);
adminBannerRouter.delete(
  "/:bannerId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deleteAdminBannerService(req.params.bannerId as string);
      res.status(200).json({
        success: true,
        message: "Bannner deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },
);
