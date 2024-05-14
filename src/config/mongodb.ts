import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "../helpers/logger";

dotenv.config();

const DB_URL = process.env.DB_URL || "";

const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

async function connectDb() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(DB_URL, { ...clientOptions, serverApi: "1" });
    await mongoose.connection.db.admin().command({ ping: 1 });
    logger.info(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await mongoose.disconnect();
  }
}

export default connectDb;
