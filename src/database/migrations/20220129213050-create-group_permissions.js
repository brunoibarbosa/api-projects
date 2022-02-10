const { EnumRoutes } = require('../../utils/permissions');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (t) => Promise.all([
      queryInterface.createTable('group_permissions', {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        group_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: 'user_groups',
            key: 'id',
          },
        },
        route_number: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        can_create: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        can_read: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        can_update: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        can_delete: {
          type: Sequelize.BOOLEAN,
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
        queryInterface.bulkInsert(
          'group_permissions',
          Object.values(EnumRoutes).map((val) => val).map((r) => ({
            group_id: 1,
            can_create: true,
            can_read: true,
            can_update: true,
            can_delete: true,
            route_number: r,
            created_at: new Date(),
            updated_at: new Date(),
          })),
        );
      }),
    ]));
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('group_permissions');
  },
};
