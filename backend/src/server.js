const path = require("path");

// Always load backend/.env regardless of where nodemon is launched from
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const app = require("./app");
const connectDB = require("./config/db");
const { syncFixedAdmins } = require("./utils/adminSeeder");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await syncFixedAdmins();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
