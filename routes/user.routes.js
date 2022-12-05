//Import router from express
const { Router } = require("express");
const { connection, getDb } = require("../config/config");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user");
const bcrypt = require("bcrypt");

//router
const userRouter = Router();

// geting databse
let database;
connection((err) => {
  if (!err) {
    database = getDb();
  }
});

/*
  signup router starts 
*/
userRouter.post("/signup", async (req, res) => {
  try {
    const { email, password, age, address } = req.body;
    if (!email) return res.send("Please provide email");
    else if (!password) return res.send("Please provide password");
    else if (!age) return res.send("Please provide age");
    else if (!address) return res.send("Please provide address");
    else {
      /*
      Storing the password in hashed format using bcrypt in to the database
      */
      bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
          return res.send("Sign up failed, Please try again");
        }
        const user = new UserModel({
          email,
          password: hash,
          age,
          address,
        });

        await database.collection("users").insertOne(user);
        // console.log(user);
        return res.send("Signup sucessfull..");
      });
    }
  } catch (err) {
    res.send(err);
  }
});
/*
  signup router ends 
*/

/*
  Login router starts 
*/
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await database.collection("users").findOne({ email });

  if (!user) {
    return res.send("Invalid credentials..");
  }

  const hashed_password = user.password;
  /*
    encrypting the password in hashed format using bcrypt from the database
    and comparing with the incoming password
  */
  await bcrypt.compare(password, hashed_password, (err, result) => {
      if(err){
        return res.send("Something went wrong please try again.")
      }
      if(result){

        const token = jwt.sign({ email: user.email, _id: user._id }, process.env.JWT_SECRET );

        return res.send({ message: "login successfull", token: token });
      }
      else{
        return res.send("Invalid credentials..");
      }
  });
});
/*
  Login router starts 
*/

module.exports = {
  userRouter,
};
