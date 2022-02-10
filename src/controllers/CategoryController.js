import Category from '../models/Category';
import Project from '../models/Project';
import ProjectImage from '../models/ProjectImage';

class CategoryController {
  async index(req, res) {
    try {
      const categories = await Category.findAll({
        include: {
          attributes: ['id', 'title', 'description', 'project_date'],
          model: Project,
          as: 'projects',
          include: {
            model: ProjectImage,
            as: 'images',
            attributes: ['id', 'description', 'path', 'originalname', 'filename', 'favorite'],
          },
          through: { attributes: [] },
        },
        ...res.locals.pagination,
      });
      return res.json(categories);
    } catch (e) {
      return res.json({
        errors: [e.message],
      });
    }
  }

  async create(req, res) {
    try {
      const newCategory = await Category.create(req.body);
      return res.json(newCategory);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async show(req, res) {
    try {
      const category = await Category.findOne({
        where: {
          id: req.params.id,
        },
        include: {
          attributes: ['id', 'title', 'description', 'project_date'],
          model: Project,
          as: 'projects',
          include: {
            model: ProjectImage,
            as: 'images',
            attributes: ['id', 'description', 'path', 'originalname', 'filename', 'favorite'],
          },
          through: { attributes: [] },
        },
      });
      return res.json(category);
    } catch (e) {
      return res.json({
        errors: [e.message],
      });
    }
  }

  async update(req, res) {
    try {
      const category = await Category.findByPk(req.params.id);

      if (!category) {
        return res.status(400).json({
          errors: ['A categoria não existe'],
        });
      }

      const newData = await category.update(req.body);
      return res.json(newData);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async delete(req, res) {
    try {
      const category = await Category.findByPk(req.params.id);

      if (!category) {
        return res.status(400).json({
          errors: ['A categoria não existe'],
        });
      }

      await category.destroy();
      return res.json(category);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
}

export default new CategoryController();
