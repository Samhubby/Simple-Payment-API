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
import { rateLimiter } from "../middlewares/ratelimit.middlewares.js";
import { USER_RATE_LIMIT_RULE } from "../utils/RatelimitRule.js";

const router = Router();

router.route("/register").post(sanitizeAndValidateUser, registerUser);
router.route("/login").post(sanitizeForLogin, loginUser);

//Secured Routes
router
  .route("/update-username")
  .patch(
    verifyJWT,
    sanitizeForUsername,
    rateLimiter(USER_RATE_LIMIT_RULE),
    updateUsername
  );
router
  .route("/update-password")
  .patch(
    verifyJWT,
    sanitizeForPassword,
    rateLimiter(USER_RATE_LIMIT_RULE),
    updatePassword
  );
router
  .route("/update-contact")
  .patch(
    verifyJWT,
    sanitizeForContact,
    rateLimiter(USER_RATE_LIMIT_RULE),
    updateContact
  );

export default router;
