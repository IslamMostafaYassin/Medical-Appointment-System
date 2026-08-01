const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("db connected");
  } catch (err) {
    console.log("Error: " + err.message);
    process.exit(1);
  }
}

module.exports = connectDB;