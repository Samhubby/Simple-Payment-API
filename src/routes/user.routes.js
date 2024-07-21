import { Router } from "express";
import verifyJWT from "../middlewares/auth.middlewares.js";
import {
  loginUser,
  registerUser,
  updateContact,
  updatePassword,
  updateUsername,
} from "../controllers/user.controllers.js";
import {
  sanitizeAndValidateUser,
  sanitizeForContact,
  sanitizeForLogin,
  sanitizeForPassword,
  sanitizeForUsername,
} from "../utils/InputValidation.js";
import { createRateLimit } from "../middlewares/ratelimit.middlewares.js";

const router = Router();

router.route("/register").post(sanitizeAndValidateUser, registerUser);
router.route("/login").post(sanitizeForLogin, loginUser);

//Secured Routes
router
  .route("/update-username")
  .patch(
    verifyJWT,
    sanitizeForUsername,
    createRateLimit("username"),
    updateUsername
  );
router
  .route("/update-password")
  .patch(
    verifyJWT,
    sanitizeForPassword,
    createRateLimit("password"),
    updatePassword
  );
router
  .route("/update-contact")
  .patch(
    verifyJWT,
    sanitizeForContact,
    createRateLimit("contact"),
    updateContact
  );

export default router;
