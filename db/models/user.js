"use strict";
const bcrypt = require("bcryptjs");

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
      hooks: {
        beforeBulkCreate: (users, options) => {
          {
            for (const user of users) {
              user.password = bcrypt.hashSync(user.password, 10);
            }
          }
        },
        beforeCreate: (user, options) => {
          {
            if (user.changed("password")) {
              user.password = bcrypt.hashSync(
                user.password,
                bcrypt.genSaltSync(10),
                null
              );
            }
            user.createdAt = new Date();
            user.updatedAt = new Date();
          }
        },
        beforeUpdate: (user, options) => {
          {
            if (user.changed("password")) {
              user.password = bcrypt.hashSync(
                user.password,
                bcrypt.genSaltSync(10),
                null
              );
            }
            user.updatedAt = new Date();
          }
        },
      },
    }
  );

  User.prototype.comparePassword = function (password) {
    console.log(password, "b-password");
    return bcrypt.compareSync(password, this.password);
  };

  return User;
};
