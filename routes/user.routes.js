//Import router from express
const { Router } = require("express");
const { connection, getDb } = require("../config/config");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user");


//router
const userRouter = Router();

let database;
connection((err) => {
  if (!err) {
    database = getDb();
  }
});

//signup router
userRouter.post("/signup", async (req, res) => {
  try {
    const { email, password, age, address } = req.body;
    if (!email) return res.send("Please provide email");
    else if (!password) return res.send("Please provide password");
    else if (!age) return res.send("Please provide age");
    else if (!address) return res.send("Please provide address");
    else {
      const user = new UserModel({
        email,
        password,
        age,
        address,
      });

      await database.collection("users").insertOne(user);

      console.log(user);
      return res.send("Signup sucessfull..");
    }
  } catch (err) {
    res.send(err);
  }
});

//login router
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await database
    .collection("users")
    .find({ email, password })
    .toArray();

  const token = jwt.sign({ email: user.email, _id: user._id }, process.env.JWT_SECRET);
  if (user.length === 0) {
    return res.send("Invalid credentials..");
  }
  return res.send({ message: "login successfull", token: token });
});

module.exports = {
  userRouter,
};
