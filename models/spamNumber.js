const { DataTypes } = require("sequelize");
const sequelize = require("../db/connection");
const User = require("./user");

const SpamNumber = sequelize.define("SpamNumber", {
  phoneNumber: {
    type: DataTypes.STRING,
  },
});

module.exports = SpamNumber;

SpamNumber.belongsTo(User, { foreignKey: "UserId" });
User.hasMany(SpamNumber);
