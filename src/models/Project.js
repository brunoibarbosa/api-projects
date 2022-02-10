import Sequelize, { Model } from 'sequelize';

export default class Project extends Model {
  static init(sequelize) {
    super.init({
      title: {
        type: Sequelize.STRING,
        defaultValue: '',
        validate: {
          len: {
            args: [3, 60],
            msg: 'O título precisa ter entre 3 e 60 caracteres',
          },
        },
      },
      description: {
        type: Sequelize.STRING,
        defaultValue: '',
        validate: {
          len: {
            args: [3, 500],
            msg: 'A descrição precisa ter entre 3 e 500 caracteres',
          },
        },
      },
      project_date: {
        type: Sequelize.DATE,
        defaultValue: '',
        validate: {
          isDate: {
            msg: 'Informe a data do projeto',
          },
        },
      },
    }, {
      sequelize,
    });
    return this;
  }

  static associate(models) {
    this.hasMany(models.ProjectImage, { foreignKey: 'project_id', as: 'images' });
    this.belongsToMany(models.Category, { through: 'ProjectsCategories', as: 'categories' });
  }
}
