import http from "http";
import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "./helpers/logger";
import app from "./app";

dotenv.config();

const DB_URL = process.env.DB_URL || "";

const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

const connectDb = async () => {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(DB_URL, { ...clientOptions, serverApi: "1" });
    await mongoose.connection.db.admin().command({ ping: 1 });
    logger.info(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } catch (err) {
    // Ensures that the client will close when you finish/error
    logger.error(err);
    await mongoose.disconnect();
  }
};

const startServer = async () => {
  await connectDb();

  const server = http.createServer(app);
  const PORT = process.env.PORT || 3001;

  server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
};

startServer().catch(console.dir);
