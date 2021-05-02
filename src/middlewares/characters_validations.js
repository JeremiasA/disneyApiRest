const { Character } = require("../dbconnect");

// validate unique name
const validateName = async (req, res, next) => {
  if (!req.body.name) {
    next();
    return;
  }

  error = null;
  const foundCharacter = await Character.findOne({
    where: { name: req.body.name },
  }).catch(err => (error = err));
  if (error) {
    res.status(500).json({ message: "Server: Connection to database failed" });
    console.log(error);
    return;
  }
  if (foundCharacter) {
    res.status(400).json({ error: "Character name already exists!" });
    return;
  } else {
    next();
    return;
  }
};

module.exports = { validateName };
