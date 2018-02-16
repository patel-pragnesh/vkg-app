'use strict';
module.exports = (sequelize, DataTypes) => {
  let Igazgatosag = sequelize.define('Igazgatosag', {
    name: DataTypes.STRING,
    name1: DataTypes.STRING
  });
  // Igazgatosag.associate = function(models) {
  //   // associations can be defined here
  // };
  return Igazgatosag;
};