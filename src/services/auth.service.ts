import { AppError } from "../errors/AppError";
import { getGoogleAuthUrl, getGoogleUserFromAuthCode } from "../lib/google";
import { signAccessToken } from "../lib/jwt";
import { logger } from "../lib/logger";
import {
  createGoogleUser,
  createUser,
  findUserByEmail,
  findUserByEmailWithPassword,
  findUserByGoogleId,
  linkGoogleIdToUser,
} from "../repositories/user.repository";
import bcrypt from "bcrypt";
import { User } from "../types/user";

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

export function startGoogleLogin(): string {
  return getGoogleAuthUrl();
}

function createAccessTokenForUser(user: User): string {
  return signAccessToken({
    userId: user.id,
    email: user.emall,
    role: user.role,
  });
}

//! FIND USER BY WITH THE GOOGLE ID IN DB...IF THERE IS NO USER WITH THE GOOGLE ID...
//! FIND THE USER WITH EMAIL WITH THE EMAIL...IF THERE IS USER WITH EMAIL...UPDATE THE USER GOOGLE ID
//! ELSE CREATE NEW USER USING TH GOOGLE ID AND EMAIL
//! CREATE THE ACCESS TOKEN WITH THE USER DATA

export async function loginWithGoogle(
  code: string,
): Promise<{ accessToken: string }> {
  const googleProfile = await getGoogleUserFromAuthCode(code);

  let user = await findUserByGoogleId(googleProfile.googleId);

  if (!user) {
    user = await findUserByEmail(googleProfile.email);

    if (user) {
      user = await linkGoogleIdToUser(user.id, googleProfile.googleId);
    } else {
      user = await createGoogleUser(
        googleProfile.email,
        googleProfile.googleId,
      );
    }
  }

  const accessToken = createAccessTokenForUser(user);
  return { accessToken };
}
