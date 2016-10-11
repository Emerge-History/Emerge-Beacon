'use strict';

module.exports = function (sequelize, DataTypes) {
  var Author = sequelize.define('Author', {
    avator: DataTypes.STRING,
    name: DataTypes.STRING,
    nickname: DataTypes.STRING,
    sex: DataTypes.STRING,
    age: DataTypes.INTEGER,
    introduce: DataTypes.STRING
  }, {
    classMethods: {
      associate: function associate(models) {
        Author.hasMany(models.Work);
      }
    }
  });
  return Author;
};