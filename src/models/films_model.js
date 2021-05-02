module.exports = (sequelize, type) => {
  return sequelize.define("film", {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: type.STRING(35),
      allowNull: false,
      unique: true,

      validate: {
        notNull: {
          msg: "Title can't be null",
        },

        not: {
          args: /[^a-zA-Z0-9 ]/g,
          msg: "Title must have only alphanumeric characters",
        },

        len: {
          args: [3, 36],
          msg: "Title length must be between 4 and 15",
        },
      },
    },
    genre: {
      type: type.STRING(36), // for only validation error
      allowNull: false,
      validate: {
        notNull: {
          msg: "Genre can't be null",
        },

        not: {
          args: /[^a-zA-Z0-9 ]/g,
          msg: "Genre must have only alphanumeric characters",
        },

        len: {
          args: [5, 36],
          msg: "Genre length must be between 4 and 15",
        },
      },
    },
    calification: {
      type: type.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Calification can't be null",
        },
        isInt: {
          msg: "Calification must be an integer",
        },
        min: {
          args: 1,
          msg: "Min value for calification is 1",
        },
        max: {
          args: 5,
          msg: "Min value for calification is 5",
        },
      },
    },

    imageurl: {
      type: type.STRING,
      allowNull: false,
      validate: {
        isUrl: {
          msg: "Invalid image URL",
        },
      },
    },
    creationdate: {
      type: type.DATEONLY,
    },
  });
};
