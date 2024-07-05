const mongoose = require("mongoose");

const encodedPassword = encodeURIComponent('Sath@projects123');
const dbURI = `mongodb+srv://SathwikUK:${encodedPassword}@projects.7zbjzgv.mongodb.net/projects?retryWrites=true&w=majority`;

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("NOT CONNECTED TO NETWORK", err);
    process.exit(1);
  }
};

module.exports = connectDB;
