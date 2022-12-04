const jwt = require("jsonwebtoken");
require("dotenv").config()


const authentication = (req, res, next) => {
  const user_token = req.headers.authorization;

  if(!user_token) {
    return res.send({ message: "Access failed - Token not provied"})
  }

  jwt.verify(user_token, "secret", function (err, decoded) {
    if (err) {
      return res.send({ message: "Access failed - Invalid token" });
    }
    next();
  });
};

module.exports = {
    authentication
}