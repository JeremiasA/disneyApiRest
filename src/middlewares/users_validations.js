const { User } = require("../dbconnect");
const { Film } = require("../dbconnect");

//verifys that username dosn't already exists
const validate_userName = async (req, res, next) => {
  if (!req.body.username) {
    res.status(400).json({ message: "Username required" });
    return;
  }

  let error = null;
  const foundUsername = await User.findOne({ where: { username: req.body.username } }).catch(err => {
    error = err;
  });
  if (error) {
    res.status(500).json({ message: "Database connection error" });
    console.log(error);
    return;
  } else if (foundUsername) {
    res.status(400).json({ message: "Error, Username already exists" });
    return;
  }
  next();
  return;
};

//verifys that email dosn't already exists

const validate_email = async (req, res, next) => {
  if (!req.body.email) {
    res.json({ message: "Email required" });
    return;
  }

  let error = null;
  const foundEmail = await User.findOne({ where: { email: req.body.email } }).catch(err => {
    error = err;
  });
  if (error) {
    res.status(500).json({ message: "Database connection error" });
    console.log(error);
    return;
  } else if (foundEmail) {
    res.status(400).json({ message: "Error, email already exists" });
    return;
  }
  next();
  return;
};

module.exports = { validate_userName, validate_email };
