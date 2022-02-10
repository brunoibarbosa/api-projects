module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (t) => Promise.all([
      queryInterface.createTable('user_groups', {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        description: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      }, { transaction: t }),
      t.afterCommit(() => {
        queryInterface.bulkInsert('user_groups', [{
          description: 'Administrador',
          created_at: new Date(),
          updated_at: new Date(),
        }]);
      }),
    ]));
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('user_groups');
  },
};
