const { Film } = require("../dbconnect");

// verifys that title dosn't already exists
const validateTitle = async (req, res, next) => {
  if (!req.body.title) {
    next();
    return;
  }
  error = null;
  const foundFilm = await Film.findOne({
    where: { title: req.body.title },
  }).catch(err => (error = err));
  if (error) {
    res.status(500).json({ message: "Server: Connection to database failed" });
    console.log(error);
    return;
  }
  if (foundFilm) {
    res.status(400).json({ error: "title already exists!" });
    return;
  } else {
    next();
    return;
  }
};

module.exports = { validateTitle };
