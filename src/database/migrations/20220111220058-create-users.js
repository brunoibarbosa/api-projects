const bcryptjs = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (t) => Promise.all([
      queryInterface.createTable('users', {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        password_hash: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        active: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        group_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'user_groups',
            key: 'id',
          },
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
      t.afterCommit(async () => {
        queryInterface.bulkInsert('users', [{
          name: 'Administrador',
          email: 'admin@mail.com',
          password_hash: await bcryptjs.hash('12345678', 8),
          active: true,
          group_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        }]);
      }),
    ]));
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('users');
  },
};
