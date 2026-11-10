import { AppError } from "../errors/AppError";
import {
  clearBannerCache,
  getBannerFromCache,
  setBannerCache,
} from "../lib/bannerCache";
import {
  deleteBannerImageFromCloudinary,
  uploadBannerImageToCloudinary,
} from "../lib/cloudinary";
import { addDeleteCloudinaryImageJob } from "../queues/deleteCloudinaryImage.queue";
import {
  createAdminbanner,
  deleteAdminBannerById,
  findAllAdminBannersFromDB,
} from "../repositories/admin.banner.repository";
import { Banner } from "../types/banner";

export async function createAdminBannerService(
  file: Express.Multer.File | undefined,
): Promise<Banner> {
  if (!file) {
    throw new AppError(400, "Image is required");
  }

  if (!file.buffer) {
    throw new AppError(400, "Image type is Invalid");
  }
  const { secureUrl, publicId } = await uploadBannerImageToCloudinary(
    file.buffer,
    { folder: "nodejs-capstone-project" },
  );

  if (!secureUrl || !publicId) {
    throw new AppError(500, "Cloudinary error occured");
  }

  const banner = await createAdminbanner(secureUrl, publicId);

  await clearBannerCache();
  return banner;
}

export async function fetchAdminBanners(): Promise<Banner[]> {
  const getCacheBanners = await getBannerFromCache();
  if (getCacheBanners) return getCacheBanners;
  const banners = await findAllAdminBannersFromDB();
  await setBannerCache(banners);
  return banners;
}

export async function deleteAdminBannerService(
  bannerId: string,
): Promise<void> {
  const publicId = await deleteAdminBannerById(bannerId);
  //   deleteBannerImageFromCloudinary(bannerId);

  if (!publicId) {
    throw new AppError(404, "Banner not found");
  }
  await clearBannerCache();

  await addDeleteCloudinaryImageJob(publicId);
}
