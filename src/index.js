const express = require("express"),
  path = require("path"),
  morgan = require("morgan"),
  app = express();

// db connect
require("./dbconnect");

// config
app.set("port", process.env.PORT || 3000);
app.use(morgan("dev"));
app.use(express.json());

//routes
app.use("/api/v1/characters", require("./routes/characters_routes"));
app.use("/api/v1/films", require("./routes/films_routes"));
app.use("/api/v1/auth", require("./routes/auth_routes"));
app.use("/", (req, res) => {
  res.status(404).json({ message: "Specified path does not exist" });
});

// server
app.listen(app.get("port"), () => {
  console.log(`Server OK at ${app.get("port")}`);
});
