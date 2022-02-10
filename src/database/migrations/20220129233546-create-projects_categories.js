module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('projects_categories', {
      project_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'projects',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      category_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'categories',
          key: 'id',
        },
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('projects_categories');
  },
};
