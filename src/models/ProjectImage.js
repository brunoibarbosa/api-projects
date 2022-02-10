import Sequelize, { Model } from 'sequelize';
import appConfig from '../config/appConfig';

export default class ProjectImage extends Model {
  static init(sequelize) {
    super.init({
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      originalname: {
        type: Sequelize.STRING,
        defaultValue: '',
        validate: {
          notEmpty: {
            msg: 'Informe o nome original do arquivo',
          },
        },
      },
      filename: {
        type: Sequelize.STRING,
        defaultValue: '',
        validate: {
          notEmpty: {
            msg: 'Informe o nome do arquivo',
          },
        },
      },
      path: {
        type: Sequelize.VIRTUAL,
        get() {
          return `${appConfig.url}/projects/images/${this.getDataValue('filename')}`;
        },
      },
      favorite: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Informe se a foto é destaque',
          },
        },
      },
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: '',
        validate: {
          notNull: {
            msg: 'Informe o projeto vinculado',
          },
        },
      },
    }, {
      sequelize,
      tableName: 'project_images',
    });
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Project);
  }
}
