const mongoose = require("mongoose");

module.exports = async () => {
  try {
    const dbURI = process.env.DB_URI;
    if (!dbURI) {
      throw new Error("Fatal Error: Database URI (DB_URI) not define");
    }

    await mongoose.connect(dbURI);

    console.log("MongoDB connection established successfully");
  } catch (err) {
    console.log("MongoDB Connection Failed");
    throw new Error(err);
  }
};
