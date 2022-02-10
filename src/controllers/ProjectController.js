import Sequelize from 'sequelize';
import database from '../config/database';
import Project from '../models/Project';
import ProjectImage from '../models/ProjectImage';
import Category from '../models/Category';
import ProjectsCategories from '../models/ProjectsCategories';

class ProjectController {
  async index(req, res) {
    try {
      const projects = await Project.findAll({
        include: [
          {
            model: ProjectImage,
            as: 'images',
            attributes: { exclude: ['project_id', 'created_at', 'updated_at', 'ProjectId'] },
            required: false,
          },
          {
            model: Category,
            as: 'categories',
            attributes: { exclude: ['created_at', 'updated_at'] },
            through: { attributes: [] },
          },
        ],
        ...res.locals.pagination,
      });
      return res.json(projects);
    } catch (e) {
      return res.json({
        errors: [e.message],
      });
    }
  }

  async create(req, res) {
    const sequelize = new Sequelize(database);
    try {
      const result = await sequelize.transaction(async (t) => {
        const newProject = await Project.create({
          title: req.body.title,
          description: req.body.description,
          project_date: req.body.project_date,
        }, { transaction: t });

        if (!req.body.categories) {
          throw { errors: [{ message: 'Informe ao menos uma categoria do projeto' }] };
        }

        for (const cat of req.body.categories) {
          const category = await Category.findOne({ where: { id: cat } });
          if (!category) {
            throw { errors: [{ message: `A categoria de ID ${cat} não existe` }] };
          }
        }

        const categories = req.body.categories.map((id) => ({
          category_id: id,
          project_id: newProject.id,
        }));

        const newCategories = await ProjectsCategories.bulkCreate(categories, { transaction: t });

        const returning = {
          id: newProject.id,
          title: newProject.title,
          description: newProject.description,
          project_date: newProject.project_date,
          created_at: newProject.created_at,
          updated_at: newProject.updated_at,
          categories: newCategories.map((cat) => (cat.CategoryId)),
        };
        return returning;
      });
      return res.json(result);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async show(req, res) {
    try {
      const project = await Project.findOne({
        where: {
          id: req.params.id,
        },
        include: [
          {
            model: ProjectImage,
            as: 'images',
            attributes: { exclude: ['project_id', 'created_at', 'updated_at', 'ProjectId'] },
            required: false,
          },
          {
            model: Category,
            as: 'categories',
            attributes: { exclude: ['created_at', 'updated_at'] },
            through: { attributes: [] },
          },
        ],
      });
      return res.json(project);
    } catch (e) {
      return res.json({
        errors: [e.message],
      });
    }
  }

  async update(req, res) {
    const sequelize = new Sequelize(database);
    try {
      const result = await sequelize.transaction(async (t) => {
        const project = await Project.findByPk(req.params.id);

        if (!project) {
          throw { errors: [{ message: 'O projeto não existe' }] };
        }

        const newData = await project.update(req.body, { transaction: t });

        const returning = {
          id: newData.id,
          title: newData.title,
          description: newData.description,
          project_date: newData.project_date,
          created_at: newData.created_at,
          updated_at: newData.updated_at,
        };

        if (req.body.categories) {
          if (req.body.categories.length === 0) {
            throw { errors: [{ message: 'Informe ao menos uma categoria do projeto' }] };
          }

          for (const cat of req.body.categories) {
            const category = await Category.findOne({ where: { id: cat } });
            if (!category) {
              throw { errors: [{ message: `A categoria de ID ${cat} não existe` }] };
            }
          }

          await ProjectsCategories.destroy(
            { where: { project_id: project.id } },
            { transaction: t },
          );
          const categories = req.body.categories.map((id) => ({
            category_id: id,
            project_id: project.id,
          }));

          const newCategories = await ProjectsCategories.bulkCreate(categories, { transaction: t });
          returning.categories = newCategories.map((cat) => (cat.CategoryId));
        }

        return returning;
      });
      return res.json(result);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async delete(req, res) {
    try {
      const project = await Project.findByPk(req.params.id);

      if (!project) {
        return res.status(400).json({
          errors: ['O projeto não existe'],
        });
      }

      await project.destroy();
      return res.json(project);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
}

export default new ProjectController();
