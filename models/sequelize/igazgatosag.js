'use strict';
module.exports = (sequelize, DataTypes) => {
  let Directorate = sequelize.define('Directorate', {
    name: DataTypes.STRING
  });
  // Directorate.associate = function(models) {
  //   // associations can be defined here
  // };
  return Directorate;
};