import { body, validationResult } from "express-validator";
import { ApiError } from "./ApiError.js";

const validateEmail = body("email")
  .trim()
  .escape()
  .not()
  .isEmpty()
  .withMessage("Email is required")
  .bail()
  .isEmail()
  .withMessage("Invalid email address");
const validateUsername = body("username")
  .trim()
  .escape()
  .not()
  .isEmpty()
  .withMessage("Username is required")
  .bail()
  .isAlpha()
  .withMessage("Username must contain only letters");
const validateContact = body("contact")
  .trim()
  .escape()
  .not()
  .isEmpty()
  .withMessage("Contact information is required")
  .bail()
  .isMobilePhone()
  .withMessage("Invalid contact number")
  .bail()
  .isLength({ min: 10, max: 10 })
  .withMessage("Contact number must be of 10 digits");
const validatePassword = body("password")
  .trim()
  .escape()
  .not()
  .isEmpty()
  .withMessage("Password is required")
  .bail()
  .isAlphanumeric()
  .withMessage("Password must be alphanumeric")
  .isLength({ min: 6 })
  .withMessage("Password should contain minimum 6 characters");

// Middleware to check validation results
const validationResults = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.send(new ApiError(400, errorMessages));
  }
  next();
};

const sanitizeAndValidateUser = [
  validateEmail,
  validateUsername,
  validatePassword,
  validateContact,
  validationResults,
];

const sanitizeForLogin = [validateContact, validatePassword, validationResults];

const sanitizeForUsername = [validateUsername, validationResults];

const sanitizeForPassword = [
  body("oldPassword")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("Old Password is required")
    .isAlphanumeric()
    .withMessage("Old Password must be alphanumeric"),
  body("newPassword")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("New Password is required")
    .isAlphanumeric()
    .withMessage("New Password must be alphanumeric"),

  validationResults,
];

const sanitizeForContact = [validateContact, validationResults];

const sanitizeForTransaction = [
  body("receiverContact")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("Contact information is required")
    .bail()
    .isLength({ max: 10 })
    .withMessage("Contact number must not exceed 10 digits")
    .bail()
    .isMobilePhone()
    .withMessage("Invalid contact number"),

  body("amount")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("Please enter the amount")
    .bail()
    .isInt()
    .withMessage("Amount must be digit")
    .bail()
    .isInt({ min: 10 })
    .withMessage("Amount must be greater than 10"),
  validatePassword,
  validationResults,
];

export {
  sanitizeAndValidateUser,
  sanitizeForLogin,
  sanitizeForUsername,
  sanitizeForPassword,
  sanitizeForTransaction,
  sanitizeForContact,
};
