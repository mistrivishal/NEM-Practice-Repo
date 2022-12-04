//Import router from express
const { Router } = require("express");
const { connection, getDb  } = require("../config/config");
const { ObjectId } = require("mongodb");

require("dotenv").config()

//router
const crudRouter = Router();

let database;
connection((err) => {
  if (!err) {
    database = getDb();
  }
});

crudRouter.get("/allusers", async (req, res) => {
  try {
    const result = await database.collection("users").find().toArray();
    if (result.length === 0) {
      return res.send("no data present..");
    }
    return res.send(result);
  } catch (err) {
    res.send(err);
  }
});

crudRouter.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const { email, password, age, address } = req.body;
    const updatedUser = {};
    if (email) updatedUser.email = email;
    if (password) updatedUser.password = password;
    if (age) updatedUser.age = age;
    if (address) updatedUser.address = address;
    await database
      .collection("users")
      .findOneAndUpdate({ _id: ObjectId(id) }, { $set: updatedUser });

    return res.send(`document with id: ${req.params.id} updated sucessfully`);
  } catch (err) {
    return res.send(`${err} document with id: ${req.params.id} not present`);
  }
});

crudRouter.delete("/delete/:id", async (req, res) => {
  try {
    await database
      .collection("users")
      .findOneAndDelete({ _id: ObjectId(req.params.id) });

    res.send(`document with id: ${req.params.id} deleted sucessfully`);
  } catch (err) {
    res.send(`document with id: ${req.params.id} not present`);
  }
});


module.exports = {
    crudRouter
}