const { MongoClient } = require("mongodb");
require("dotenv").config()

const uri = process.env.MONGO_URI;

let database;
/*
  exporting the connection method and getDb method 
*/
module.exports = {
  connection: async (fun) => {
    const client = new MongoClient(uri, {useNewUrlParser: true,useUnifiedTopology: true});
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
