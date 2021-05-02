// imports
const { Sequelize } = require("sequelize");
const films_model = require("./models/films_model");
const characters_model = require("./models/characters_model");
const films_characters_model = require("./models/films_characters_model");
const users_model = require("./models/users_model");
const config = require("./config");

// Sequelize instance
const sequelize = new Sequelize(config.dbName, config.userName, config.password, {
  host: config.host,
  dialect: "mysql",
});

// models
const Film = films_model(sequelize, Sequelize);
const Character = characters_model(sequelize, Sequelize);
const User = users_model(sequelize, Sequelize);
const Film_character = films_characters_model(sequelize, Sequelize);

// Sync Up
(async () => {
  let error = null;
  await sequelize.sync({ force: false }).catch(err => (error = err));
  if (error) console.log("Sync ERROR: ", error);
  else console.log("Table SyncUp OK!");
})();

module.exports = { Film, Character, User, Film_character };
