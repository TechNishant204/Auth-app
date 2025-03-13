const express = require("express");
const dbConnect = require("./config/database");
const router = require("./routes/user");
const cookieParser = require("cookie-parser");
require("dotenv").config();

//instantiate the server
const app = express();

const PORT = process.env.PORT || 3000;

//middleware parse json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//connect to db
dbConnect.dbConnect();

// here we are using the router we created in routes/user.js file
app.use("/api/v1", router);

//activate the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
