// models/associations.js
import User from "./user.models.js";
import Transaction from "./transaction.models.js";


User.hasMany(Transaction, { foreignKey: "senderId", as: "sentTransactions" });
User.hasMany(Transaction, { foreignKey: "receiverId", as: "receivedTransactions" });
Transaction.belongsTo(User, { foreignKey: "senderId", as: "sender" });
Transaction.belongsTo(User, { foreignKey: "receiverId", as: "receiver" });



export { User, Transaction };
