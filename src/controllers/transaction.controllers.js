import sequelize from "../db/index.js";
import { User, Transaction } from "../models/associations.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const transferMoney = async (req, res) => {
  try {
    const { receiverContact, amount, password } = req.body;
    const contact = req.user.contact;

    // Start transaction
    await sequelize.transaction(async (t) => {
      
      // Find the sender with row locking
      const sender = await User.findOne({
        where: { contact },
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      if (!sender) {
        throw new ApiError(404, "Sender not Found");
      }

      if (sender.contact === receiverContact) {
        throw new ApiError(409, "Cannot Send Money to Own Account");
      }

      // Find the receiver with row locking
      const receiver = await User.findOne({
        where: { contact: receiverContact },
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      if (!receiver) {
        throw new ApiError(404, "Receiver not Found");
      }

      // Verify sender's password
      const isPasswordValid = await sender.isPasswordCorrect(password);
      if (!isPasswordValid) {
        throw new ApiError(401, "Invalid Password");
      }

      // Check if sender has enough balance
      if (sender.balance < amount) {
        throw new ApiError(400, "Insufficient balance");
      }

      // Create the transaction record
      const transaction = await Transaction.create(
        {
          senderId: sender.id,
          receiverId: receiver.id,
          amount,
        },
        { transaction: t }
      );

      // Update sender's balance
      sender.balance -= +amount;
      await sender.save({ transaction: t });

      // Update receiver's balance
      receiver.balance += +amount;
      await receiver.save({ transaction: t });

      // Mark the transaction as completed
      transaction.status = "completed";
      await transaction.save({ transaction: t });

      return res
        .status(200)
        .json(new ApiResponse(200, transaction, "Transferred Successfully"));
    });
  } catch (error) {
    const statusCode = error?.statusCode || 500;
    return res.status(statusCode).json(new ApiError(statusCode, error.message));
  }
};

export { transferMoney };
