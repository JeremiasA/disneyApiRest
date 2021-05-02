const jwt = require("jsonwebtoken");
const { User } = require("../dbconnect");
const { JWTKey } = require("../config");

const verifyToken = async (req, res, next) => {
  // check token existence
  const token = req.headers["x-access-token"];
  if (!token) return res.json({ message: "Token not provided. Login again please!" });

  // decode token
  try {
    const decoded = jwt.verify(token, JWTKey);
    req.userId = decoded.data.id;
  } catch (error) {
    return res.status(404).json({ message: "Security problem. Login again please!" });
  }

  //Find user by Id
  let error = null;
  const user = await User.findByPk(req.userId).catch(err => {
    error = err;
  });
  if (error) {
    console.log(error);
    return res.status(500).json({ message: "Database connection error" });
  } else {
    if (!user) return res.status(400).json({ message: "Invalid user" });
    else {
      next();
      return;
    }
  }
};

module.exports = { verifyToken };
