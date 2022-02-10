import Sequelize, { Model } from 'sequelize';

export default class ProjectsCategories extends Model {
  static init(sequelize) {
    super.init({
      category_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      project_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
    }, {
      sequelize,
      timestamps: false,
    });

    return this;
  }
}
