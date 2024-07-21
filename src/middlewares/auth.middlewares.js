import User from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token)
      throw new ApiError(401, "Unauthorized Access!! Please Login First");

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) throw new ApiError(400, "Invalid Token");

    const user = await User.findByPk(decodedToken?._id);
    if (!user) throw new ApiError(404, "Bad request! User not Found");

    req.user = user;
    next();
  } catch (error) {
    const statusCode = error?.statusCode || 500;
    res.status(statusCode).json(new ApiError(statusCode, error.message));
  }
};

export default verifyJWT;
