import Sequelize, { Model } from 'sequelize';

export default class AccountRecovery extends Model {
  static init(sequelize) {
    super.init({
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: '',
        validate: {
          notNull: {
            msg: 'Informe o usuário vinculado',
          },
        },
      },
      token: {
        type: Sequelize.STRING,
        defaultValue: '',
        validate: {
          notEmpty: {
            msg: 'Informe o token',
          },
        },
      },
      used: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Informe se o token foi utilizado ou não',
          },
        },
      },
      valid: {
        type: Sequelize.VIRTUAL,
        get() {
          const max_datetime = this.getDataValue('created_at');
          max_datetime.setDate(max_datetime.getDate() + 2);
          return (new Date() <= max_datetime) && (!this.getDataValue('used'));
        },
      },
    }, {
      sequelize,
    });
    return this;
  }
}
