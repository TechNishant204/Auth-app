const mongoose = require("mongoose");

require("dotenv").config();

exports.dbConnect = () => {
  mongoose
    .connect(process.env.DATABASE_URL)
    .then(console.log("Connected to MongoDB Successfully."))
    .catch((err) => {
      console.log("Connection to MONGODB failed: ", err);
      process.exit(1);
    });
};
