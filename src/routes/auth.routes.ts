import { Router } from "express";
import {
  loginUser,
  loginWithGoogle,
  registerUser,
  startGoogleLogin,
} from "../services/auth.service";
import { authenticate } from "../middleware/auth.middleware";

export const authRouter = Router();

authRouter.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    await registerUser(email, password);

    res.status(201).json({
      success: true,
      message: "Registration successful. Please login to continue.",
    });
  } catch (error) {
    next(error);
  }
});
authRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { accessToken } = await loginUser(email, password);

    res.status(200).json({
      success: true,
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
});
authRouter.get("/me", authenticate, async (req, res) => {
  res.status(200).json({
    success: true,
    data: { user: req.user },
  });
});

authRouter.get("/google", (req, res) => {
  const googleAuthurl = startGoogleLogin();
  res.redirect(googleAuthurl);
});

authRouter.get("/google/callback", async (req, res, next) => {
  try {
    const code = req.query.code as string | undefined;
    const { accessToken } = await loginWithGoogle(code as string);
    return res.status(200).json({ success: true, data: { accessToken } });
  } catch (error) {
    next(error);
  }
});
