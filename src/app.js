import cookieParser from "cookie-parser";
import express from "express";

export const app = express();

//Common Middlewares
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: false }));

//Importing Routes
import userRouter from "./routes/user.routes.js";
import transactionRouter from "./routes/transaction.routes.js";

// Routes
app.use("/api/v1/users/", userRouter);
app.use("/api/v1/transaction/", transactionRouter);
