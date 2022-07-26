const mongoose = require("mongoose");
const logger = require("../config/logservice");

const connectDB = async () => {
  try {
    const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`
    console.log(uri);
    await mongoose
      .connect(uri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
      })
      .catch((error) => logger.log(error));
    const connection = mongoose.connection;
    logger.debug("MONGODB CONNECTED SUCCESSFULLY!");
  } catch (error) {
    logger.log(error);
    return error;
  }
};

module.exports = connectDB;
