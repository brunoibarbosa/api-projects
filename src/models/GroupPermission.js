import Sequelize, { Model } from 'sequelize';
import { EnumRoutes } from '../utils/permissions';

export default class GroupPermission extends Model {
  static init(sequelize) {
    super.init({
      group_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        validate: {
          notNull: {
            msg: 'Informe o grupo do usuário',
          },
        },
      },
      route_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Informe o número da rota',
          },
          exists(value) {
            if (!Object.values(EnumRoutes).includes(value)) {
              throw new Error('Informe um número de rota válido');
            }
          },
        },
      },
      can_create: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Informe se o grupo de usuário terá permissão para criar',
          },
        },
      },
      can_read: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Informe se o grupo de usuário terá permissão para ler',
          },
        },
      },
      can_update: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Informe se o grupo de usuário terá permissão para atualizar',
          },
        },
      },
      can_delete: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Informe se o grupo de usuário terá permissão para deletar',
          },
        },
      },
    }, {
      sequelize,
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.UserGroup, { foreignKey: 'group_id', as: 'user_group' });
  }
}
