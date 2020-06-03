module.exports = function (sequelize, DataTypes) {
  const Post = sequelize.define("Post", {
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 50],
      },
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 50],
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 50],
      },
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [1, 50],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
      },
    },
  });
  Post.associate = function (models) {
    Post.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Post;
};
