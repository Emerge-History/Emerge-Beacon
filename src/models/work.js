"use strict";

module.exports = function(sequelize, DataTypes) {
  var Work = sequelize.define("Work", {
    img: DataTypes.STRING,
    name: DataTypes.STRING,
    material: DataTypes.STRING,
    year: DataTypes.STRING,
    size: DataTypes.STRING,
    color: DataTypes.STRING,
    introduce: DataTypes.STRING,
    voice: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Work.belongsTo(models.Author, {
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });
  return Work;
};
