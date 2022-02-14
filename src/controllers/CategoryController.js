import Category from '../models/Category';
import Project from '../models/Project';
import ProjectImage from '../models/ProjectImage';

class CategoryController {
  async index(req, res) {
    /*
    #swagger.summary = 'read all categories',
    #swagger.tags = ['Category'],
    #swagger.description = 'Obter todos as categorias.',

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

      /*
      #swagger.responses[200] = {
        schema: [{ $ref: "#/definitions/Category" }],
        description: 'Categorias encontrados.'
      }
      */
      return res.json(categories);
    } catch (e) {
      return res.status(400).json({
        errors: [e.message],
      });
    }
  }

  async create(req, res) {
    /*
    #swagger.summary = 'create category',
    #swagger.tags = ['Category'],
    #swagger.description = 'Adicionar uma categoria.',

    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Informações da categoria.',
      required: true,
      schema: {
        description: 'string',
      }
    }
    */

    try {
      const newCategory = await Category.create(req.body);

      /*
      #swagger.responses[201] = {
        schema: {
          id: 0,
          description: "string",
          created_at: "2022-01-01T00:00:00.000Z",
          updated_at: "2022-01-01T00:00:00.000Z"
        },
        description: 'Categoria registrada com sucesso'
      }
      */
      return res.json(newCategory);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async show(req, res) {
    /*
    #swagger.summary = 'read category',
    #swagger.tags = ['Category'],
    #swagger.description = 'Obter uma categoria.',
    #swagger.parameters['id'] = {
      description: 'ID da categoria.',
      type: 'integer'
    }
    */

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

      /*
      #swagger.responses[200] = {
        schema: { $ref: "#/definitions/Category" },
        description: 'Categoria encontrada.'
      }
      */
      return res.json(category);
    } catch (e) {
      return res.status(400).json({
        errors: [e.message],
      });
    }
  }

  async update(req, res) {
    /*
    #swagger.summary = 'update category',
    #swagger.tags = ['Category'],
    #swagger.description = 'Atualizar uma categoria.',

    #swagger.parameters['id'] = {
      description: 'ID da categoria.',
      type: 'integer'
    }

    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Informações do grupo.',
      required: true,
      schema: {
        description: 'string',
      }
    }
    */

    try {
      const category = await Category.findByPk(req.params.id);

      if (!category) {
        return res.status(400).json({
          errors: ['A categoria não existe'],
        });
      }

      const newData = await category.update(req.body);

      /*
      #swagger.responses[200] = {
        schema: {
          id: 0,
          description: "string",
          created_at: "2022-01-01T00:00:00.000Z",
          updated_at: "2022-01-01T00:00:00.000Z"
        },
        description: 'Categoria atualizada com sucesso'
      }
      */
      return res.json(newData);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async delete(req, res) {
    /*
    #swagger.summary = 'delete category',
    #swagger.tags = ['Category'],
    #swagger.description = 'Remover uma categoria.',

    #swagger.parameters['id'] = {
      description: 'ID da categoria.',
      type: 'integer'
    }
    */

    try {
      const category = await Category.findByPk(req.params.id);

      if (!category) {
        return res.status(400).json({
          errors: ['A categoria não existe'],
        });
      }

      await category.destroy();

      /*
      #swagger.responses[200] = {
        schema: {
          id: 0,
          description: "string",
          created_at: "2022-01-01T00:00:00.000Z",
          updated_at: "2022-01-01T00:00:00.000Z"
        },
        description: 'Categoria removida com sucesso'
      }
      */
      return res.json(category);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
}

export default new CategoryController();
