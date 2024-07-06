const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Unable to connect with database!", err);
    process.exit(1);
  }
};

module.exports = connectDB;
