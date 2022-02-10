import Sequelize, { Model } from 'sequelize';

export default class Category extends Model {
  static init(sequelize) {
    super.init({
      description: {
        type: Sequelize.STRING,
        defaultValue: '',
        validate: {
          len: {
            args: [3, 100],
            msg: 'A descrição precisa ter entre 3 e 100 caracteres',
          },
        },
      },
    }, {
      sequelize,
    });
    return this;
  }

  static associate(models) {
    this.belongsToMany(models.Project, { through: 'ProjectsCategories', as: 'projects' });
  }
}
