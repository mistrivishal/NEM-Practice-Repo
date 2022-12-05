//Import Packages
const express = require("express");
const { connection, getDb } = require("./config/config");
const { authentication } = require("./middlewares/jwtautho");
const { userRouter } = require("./routes/user.routes");
const { crudRouter } = require("./routes/usercrud.routes");
require("dotenv").config()

const app = express();

// middlewares
app.use(express.json());

let database;

// connecting to database
connection((err) => {
  if (!err) {
    app.listen(process.env.PORT, () => {
      console.log("connected to database successfully");
      console.log(`listening on the port ${process.env.PORT}`);
    });
    database = getDb();
  }
});

//routes
app.get("/", async (req, res) => {
  res.send("Welcome to Home Page..");
});

app.use("/user", userRouter);
app.use(authentication);
app.use("/user", crudRouter);

