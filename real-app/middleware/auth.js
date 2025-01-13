const jwt = require("jsonwebtoken");
const config = require("../config/config");

module.exports = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    res.status(400).send("Access Denied, pls provide Token");
    return;
  }
  try {
    const details = jwt.verify(token, config.jwtkey);
    req.user = details;
    next();
  } catch {
    res.status(400).send("Invalid Token Provided");
  }
};
