const { MongoClient } = require("mongodb");
require("dotenv").config()

const uri = process.env.MONGO_URI;

let database;

module.exports = {
  connection: async (fun) => {
    const client = new MongoClient(uri);
    try {
      await client.connect();
      database = client.db("usersdata");
      return fun();
    } catch (err) {
      console.log("error in connection.", err);
      return fun(err);
    }
  },
  getDb: () => database,
};
