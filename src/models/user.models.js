import { DataTypes } from "sequelize";
import connection from "../db/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config.js";


const User = connection.define(
  "Users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING(320),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        isAlpha: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    contact: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    balance: {
      type: DataTypes.INTEGER,
      defaultValue: 100,
      validate: {
        min: 0,
      },
    },
    role: {
      type: DataTypes.ENUM("User", "Admin"),
      defaultValue: "User",
      allowNull: false,
    },
  },
  {
    timestamps: false,

    //Hashing Passwords before Model creation
    hooks: {
      beforeCreate: async (user) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      },
      beforeUpdate: async (user) => {
        // Hash the password if it has been modified (or is new)
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

//Custom method for generating JWT Token
User.prototype.generateToken = function () {
  return jwt.sign(
    {
      _id: this.id,
      email: this.email,
      username: this.username,
      contact: this.contact,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRY }
  );
};

//Custom method for password validation
User.prototype.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default User;
