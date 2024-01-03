"use strict";
const models = require("../models");
const User = models.User;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await User.bulkCreate(
      [
        {
          name: "Admin",
          email: "admin@admin.com",
          password: "password",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
