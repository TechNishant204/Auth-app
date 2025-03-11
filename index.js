const express = require("express");
const dbConnect = require("./config/database");
const router = require("./routes/user");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;

//middleware parse json
app.use(express.json());

//connect to db
dbConnect.dbConnect();

app.use("/api/v1", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
