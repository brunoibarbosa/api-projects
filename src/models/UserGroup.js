import Sequelize, { Model } from 'sequelize';

export default class UserGroup extends Model {
  static init(sequelize) {
    super.init({
      description: {
        type: Sequelize.STRING,
        defaultValue: '',
        unique: {
          msg: 'Já existe um grupo de usuário com essa descrição',
        },
        validate: {
          len: {
            args: [3, 64],
            msg: 'O nome deve ter entre 3 e 64 caracteres',
          },
        },
      },
    }, {
      sequelize,
    });
    return this;
  }

  static associate(models) {
    this.hasOne(models.User, { foreignKey: 'group_id', as: 'group' });
    this.hasOne(models.GroupPermission, { foreignKey: 'group_id', as: 'user_group' });
  }
}
