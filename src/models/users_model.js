module.exports = (sequelize, type) => {
  return sequelize.define("user", {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: type.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: "Username required",
        },

        not: {
          args: /[^a-zA-Z0-9 ]/g,
          msg: "Username must have only alphanumeric characters",
        },

        len: {
          args: [6, 11],
          msg: "Username length must be between 5 and 10",
        },
      },
    },
    email: {
      type: type.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: "Email required",
        },

        isEmail: {
          msg: "Invalid Email format",
        },
      },
    },
    password: {
      type: type.STRING,
      allowNull: false,

      validate: {
        notNull: {
          msg: "Password required",
        },
      },
    },
  });
};
