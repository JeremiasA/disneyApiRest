module.exports = (sequelize, type) => {
  return sequelize.define("filmcharacter", {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    filmtitle: {
      type: type.STRING,
    },
    charactername: {
      type: type.STRING,
    },
  });
};
