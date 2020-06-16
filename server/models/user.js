'use strict';
const bcrypt = require('bcrypt');
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.Sequelize.Model;
  class User extends Model{

  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please input email'
        },
        notEmpty: {
          msg: 'Please input email'
        },
        isEmail: {
          msg: 'Please input right email'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please input password'
        },
        notEmpty: {
          msg: 'Please input password'
        }
      }
    },
    organization: DataTypes.STRING
  }, {
    sequelize
  });
  User.beforeCreate((instance, options) => {
    instance.organization = 'Hacktiv8';
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(instance.password, salt);
    instance.password = hash;
  })
  User.associate = function(models) {
    User.hasMany(models.Task);
  };
  return User;
};