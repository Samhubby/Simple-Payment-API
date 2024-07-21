import { Router } from "express";
import verifyJWT from "../middlewares/auth.middlewares.js";
import { transferMoney } from "../controllers/transaction.controllers.js";
import { sanitizeForTransaction } from "../utils/InputValidation.js";

const router = Router();

router
  .route("/transfer-money")
  .post(verifyJWT, sanitizeForTransaction, transferMoney);

export default router;
