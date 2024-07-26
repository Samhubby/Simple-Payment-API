import { Sequelize } from "sequelize";
import "dotenv/config.js";

const sequelize = new Sequelize(
  process.env.AZURE_DB,
  process.env.AZURE_DB_USERNAME,
  process.env.AZURE_DB_PASSWORD,
  {
    host: process.env.AZURE_DB_HOST,
    dialect: "mysql",
    logging: false,
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    sequelize.sync();
    console.log("Connected to MySQL");
  } catch (error) {
    console.log("Error in connecting MySQL", error.message);
  }
};

export default sequelize;
