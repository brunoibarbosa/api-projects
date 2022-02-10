module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('project_images', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      filename: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      originalname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      favorite: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'projects',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('project_images');
  },
};
