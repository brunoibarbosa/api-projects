import Sequelize, { Model } from 'sequelize';
import bcryptjs from 'bcryptjs';

export default class User extends Model {
  static init(sequelize) {
    super.init({
      name: {
        type: Sequelize.STRING,
        defaultValue: '',
        validate: {
          len: {
            args: [3, 64],
            msg: 'O nome deve ter entre 3 e 64 caracteres',
          },
        },
      },
      email: {
        type: Sequelize.STRING,
        defaultValue: '',
        unique: {
          msg: 'O email já existe',
        },
        validate: {
          isEmail: {
            msg: 'O email é inválido',
          },
        },
      },
      password_hash: {
        type: Sequelize.STRING,
        defaultValue: '',
      },
      password: {
        type: Sequelize.VIRTUAL,
        defaultValue: '',
        validate: {
          len: {
            args: [8, 64],
            msg: 'A senha precisa ter entre 8 e 64 caracteres',
          },
        },
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Informe se o usuário está ativo',
          },
        },
      },
      group_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Informe o grupo do usuário',
          },
        },
      },
    }, {
      sequelize,
    });

    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcryptjs.hash(user.password, 8);
      }
    });

    return this;
  }

  passwordIsValid(password) {
    return bcryptjs.compare(password, this.password_hash);
  }

  static associate(models) {
    this.belongsTo(models.UserGroup, { foreignKey: 'group_id', as: 'group' });
  }
}
