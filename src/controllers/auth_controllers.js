const { User } = require("../dbconnect");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
  let error = null;

  //Username doesn't exists validation
  const foundUser = await User.findOne({ where: { username: req.body.username } }).catch(err => {
    err = error;
  });
  if (error) {
    res.status(500).json({ message: "Database connection error" });
    console.log(error);
    return;
  }

  if (!foundUser) return res.status(404).json({ message: "Username doesn't exist " });

  //Pass doesn't exists validation
  const foundPass = await bcrypt.compare(req.body.password, foundUser.password);
  if (!foundPass) return res.status(404).json({ message: "Invalid password" });

  // token creation
  const JWTKey = require("../config").JWTKey;

  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      data: { id: foundUser.id },
    },
    JWTKey
  );
  return res.status(200).json({ token: token });
};

const register = async (req, res) => {
  //create user

  let error = null;
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, 10),
  }).catch(err => {
    error = err;
  });
  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }

  // token creation

  const JWTKey = require("../config").JWTKey;

  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60, //1 hora
      data: { id: newUser.id },
    },
    JWTKey
  );

  res.status(200).json({ token: token, user: newUser.username });
};

module.exports = { login, register };
