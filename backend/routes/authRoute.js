import { Router } from "express";
import passport from "../config/passport.js";
import {
  login,
  signup,
  logout,
  checkAlreadyLoggedIn,
  googleAuth,
} from "../controllers/authController.js";
import isAuth from "../middleware/isAuth.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  googleAuth
);

router.get("/checkLoggedIn", isAuth, checkAlreadyLoggedIn);

export default router;
