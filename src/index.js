import { app } from "./app.js";
import "dotenv/config.js";
import { connectDB } from "./db/index.js";

const PORT = process.env.PORT || 3000;

//DB Connection
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server started at PORT: ${PORT}`);
    });
  })
  .catch(() => console.log("Error while connecting to MySQL"));
