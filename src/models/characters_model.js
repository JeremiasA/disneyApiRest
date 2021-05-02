module.exports = (sequelize, type) => {
  return sequelize.define("character", {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: type.STRING(25),
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: "Name can't be null",
        },

        not: {
          args: /[^a-zA-Z0-9 ]/g,
          msg: "Name must have only alphanumeric characters",
        },

        len: {
          args: [3, 21],
          msg: "Name length must be between 4 and 20",
        },
      },
    },
    age: {
      type: type.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Age can't be null",
        },
        isInt: {
          msg: "Age must be an integer",
        },
        min: {
          args: 1,
          msg: "Min value for age is 1",
        },
        max: {
          args: 100,
          msg: "Max value for age is 100",
        },
      },
    },
    weigth: {
      type: type.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Weigth can't be null",
        },
        isInt: {
          msg: "Weigth must be an integer",
        },
        min: {
          args: 1,
          msg: "Min value for weigth is 1",
        },
        max: {
          args: 10000,
          msg: "Max value for calification is 10000",
        },
      },
    },
    story: {
      type: type.STRING(),
      allowNull: false,
      validate: {
        notNull: {
          msg: "Story can't be null",
        },

        len: {
          args: [16, 151],
          msg: "Story length must be between 15 and 150",
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
  });
};
