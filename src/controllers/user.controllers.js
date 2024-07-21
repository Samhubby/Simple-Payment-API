import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { Op } from "sequelize";

const registerUser = async (req, res) => {
  try {
    const { email, password, username, contact } = req.body;

    // Validate user existence
    const existedUser = await User.findOne({
      where: { [Op.or]: [{ email }, { contact }, { username }] },
    });
    if (existedUser) {
      throw new ApiError(409, "User already exists");
    }

    // Create user in the database
    const createdUser = await User.create({
      email,
      username,
      password,
      contact,
    });

    if (!createdUser) {
      throw new ApiError(500, "Failed to create user");
    }

    //Generate JWT with custom method
    const token = await createdUser.generateToken();
    const options = {
      httpOnly: true,
      secure: true,
    };

    // Respond with success message and user data
    return res
      .status(200)
      .cookie("accessToken", token, options)
      .json(
        new ApiResponse(200, { username, token }, "User created successfully")
      );
  } catch (error) {
    const statusCode = error?.statusCode || 500;
    return res.status(statusCode).json(new ApiError(statusCode, error.message));
  }
};

const loginUser = async (req, res) => {
  try {
    const { contact, password } = req.body;
    const user = await User.findOne({
      where: { contact },
    });
    if (!user) {
      throw new ApiError(404, "User does not exist");
    }

    // Verify password with custom method
    const passwordValid = await user.isPasswordCorrect(password);
    if (!passwordValid) {
      throw new ApiError(404, "Incorrect contact or password combination");
    }

    const token = await user.generateToken();
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .cookie("accessToken", token, options)
      .json(
        new ApiResponse(200, { token: token }, "User Logged In Successfully!")
      );
  } catch (error) {
    const statusCode = error?.statusCode || 500;
    res.status(statusCode).json(new ApiError(statusCode, error.message));
  }
};

const updateUsername = async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findByPk(req.user?.id);
    if (!user) throw new ApiError(404, "User not Found");

    if (user.username === username)
      throw new ApiError(409, "No any changes made");

    // Check if the new username is already taken by another user
    const existingUser = await User.findOne({ where: { username: username } });
    if (existingUser) {
      throw new ApiError(409, "This username is already taken");
    }

    //Updation
    user.username = username;
    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, "", "Username updated successfully"));
  } catch (error) {
    const statusCode = error?.statusCode || 500;
    return res.status(statusCode).json(new ApiError(statusCode, error.message));
  }
};

const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findByPk(req.user?.id);
    if (!user) throw new ApiError(400, "User not Found");

    //Validate old password
    const isPasswordValid = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordValid) throw new ApiError(404, "Incorrect Old Password");

    //Updation
    user.password = newPassword;
    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, "", "Password updated successfully"));
  } catch (error) {
    const statusCode = error?.statusCode || 500;
    res.status(statusCode).json(new ApiError(statusCode, error.message));
  }
};

const updateContact = async (req, res) => {
  try {
    const { contact } = req.body;
    const user = await User.findByPk(req.user?.id);
    if (!user) throw new ApiError(404, "User not Found");

    if (user.contact === contact)
      throw new ApiError(409, "No any changes made");

    const existingUser = await User.findOne({ where: { contact: contact } });
    if (existingUser) {
      throw new ApiError(409, "This contact is already registered");
    }
    //Updation
    user.contact = contact;
    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, "", "Contact updated successfully"));
  } catch (error) {
    const statusCode = error?.statusCode || 500;
    res.status(statusCode).json(new ApiError(statusCode, error.message));
  }
};

export {
  registerUser,
  loginUser,
  updateUsername,
  updatePassword,
  updateContact,
};
