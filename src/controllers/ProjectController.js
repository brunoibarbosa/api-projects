import Sequelize from 'sequelize';
import database from '../config/database';
import Project from '../models/Project';
import ProjectImage from '../models/ProjectImage';
import Category from '../models/Category';
import ProjectsCategories from '../models/ProjectsCategories';

class ProjectController {
  async index(req, res) {
    /*
    #swagger.summary = 'read all projects',
    #swagger.tags = ['Project'],
    #swagger.description = 'Obter todos os projetos.',

    #swagger.parameters['limit'] = {
      description: 'Quantidade máxima de registros que irão retornar.',
      type: 'integer'
    },
    #swagger.parameters['offset'] = {
      description: 'A partir de quantos registros irá retornar.',
      type: 'integer'
    }
    */

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

      /*
      #swagger.responses[200] = {
        schema: [{ $ref: "#/definitions/Project" }],
        description: 'Projetos encontrados.'
      }
      */
      return res.json(projects);
    } catch (e) {
      return res.status(400).json({
        errors: [e.message],
      });
    }
  }

  async create(req, res) {
    /*
    #swagger.summary = 'create project',
    #swagger.tags = ['Project'],
    #swagger.description = 'Adicionar um projeto.',

    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Informações do projeto.',
      required: true,
      schema: {
        title: 'string',
        description: 'string',
        project_date: '2022-01-01',
        categories: [0],
      }
    }
    */

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

      /*
      #swagger.responses[201] = {
        schema: {
          id: 0,
          title: 'string',
          description: 'string',
          project_date: '2022-01-01T00:00:00.000Z',
          created_at: '2022-01-01T00:00:00.000Z',
          updated_at: '2022-01-01T00:00:00.000Z',
          categories: [0]
        },
        description: 'Projeto registrado com sucesso'
      }
      */
      return res.json(result);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async show(req, res) {
    /*
    #swagger.summary = 'read project',
    #swagger.tags = ['Project'],
    #swagger.description = 'Obter um projeto.',
    #swagger.parameters['id'] = {
      description: 'ID do projeto.',
      type: 'integer'
    }
    */

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

      /*
      #swagger.responses[200] = {
        schema: { $ref: "#/definitions/Project" },
        description: 'Projeto encontrado.'
      }
      */
      return res.json(project);
    } catch (e) {
      return res.status(400).json({
        errors: [e.message],
      });
    }
  }

  async update(req, res) {
    /*
    #swagger.summary = 'update project',
    #swagger.tags = ['Project'],
    #swagger.description = 'Atualizar um projeto.',

    #swagger.parameters['id'] = {
      description: 'ID do projeto.',
      type: 'integer'
    }

    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Informações do projeto.',
      required: true,
      schema: {
        description: 'string',
        categories: [0],
      }
    }
    */

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

      /*
      #swagger.responses[200] = {
        schema: {
          id: 0,
          title: 'string',
          description: 'string',
          project_date: '2022-01-01T00:00:00.000Z',
          created_at: '2022-01-01T00:00:00.000Z',
          updated_at: '2022-01-01T00:00:00.000Z',
          categories: [0]
        },
        description: 'Projeto atualizado com sucesso'
      }
      */
      return res.json(result);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async delete(req, res) {
    /*
    #swagger.summary = 'delete project',
    #swagger.tags = ['Project'],
    #swagger.description = 'Remover um projeto.',

    #swagger.parameters['id'] = {
      description: 'ID do projeto.',
      type: 'integer'
    }
    */

    try {
      const project = await Project.findByPk(req.params.id);

      if (!project) {
        return res.status(400).json({
          errors: ['O projeto não existe'],
        });
      }

      await project.destroy();

      /*
      #swagger.responses[200] = {
        schema: {
          id: 0,
          title: 'string',
          description: 'string',
          project_date: '2022-01-01T00:00:00.000Z',
          created_at: '2022-01-01T00:00:00.000Z',
          updated_at: '2022-01-01T00:00:00.000Z',
        },
        description: 'Projeto removido com sucesso'
      }
      */
      return res.json(project);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
}

export default new ProjectController();
