import { AppError } from "../errors/AppError";
import { signAccessToken } from "../lib/jwt";
import { logger } from "../lib/logger";
import {
  createUser,
  findUserByEmail,
  findUserByEmailWithPassword,
} from "../repositories/user.repository";
import bcrypt from "bcrypt";

export async function registerUser(
  email: string,
  password: string,
): Promise<void> {
  if (!email || !password) {
    throw new AppError(400, "Email and Password are required");
  }
  if (password.length < 6) {
    throw new AppError(400, "Password must be at least 6 characters long");
  }

  const normalizeEmail = email.toLowerCase().trim();

  const existingUser = await findUserByEmail(normalizeEmail);

  if (existingUser) {
    throw new AppError(409, "Email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await createUser(normalizeEmail, passwordHash);
}
export async function loginUser(
  email: string,
  password: string,
): Promise<{ accessToken: string }> {
  if (!email || !password) {
    throw new AppError(400, "Email and Password are required");
  }
  const normalizeEmail = email.toLowerCase().trim();

  const user = await findUserByEmailWithPassword(normalizeEmail);
  if (!user?.password_hash) {
    throw new AppError(401, "Invalid email or password");
  }
  const passwordHash = await bcrypt.compare(password, user.password_hash);

  if (!passwordHash) {
    throw new AppError(401, "Invalid email or password");
  }
  const payload = { email: user.emall, userId: user.id, role: user.role };
  const accessToken = signAccessToken(payload);

  return { accessToken };
}
