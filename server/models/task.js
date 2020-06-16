'use strict';
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.Sequelize.Model;
  class Task extends Model{

  }
  Task.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please input title'
        },
        notEmpty: {
          msg: 'Please input title'
        }
      }
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please input category'
        },
        notEmpty: {
          msg: 'Please input category'
        }
      }
    },
    UserId: {
      type: DataTypes.INTEGER
    }
  }, {
    sequelize
  });
  Task.associate = function(models) {
    Task.belongsTo(models.User);
  };
  return Task;
};