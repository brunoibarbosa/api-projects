import UserGroup from '../models/UserGroup';

class UserGroupController {
  async index(req, res) {
    /*
    #swagger.summary = 'read all groups',
    #swagger.tags = ['User Group'],
    #swagger.description = 'Obter todos os grupos de usuários.',

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
      const groups = await UserGroup.findAll({ ...res.locals.pagination });

      /*
      #swagger.responses[200] = {
        schema: [{ $ref: "#/definitions/UserGroup" }],
        description: 'Grupos encontrados.'
      }
      */
      return res.json(groups);
    } catch (e) {
      return res.status(400).json({
        errors: [e.message],
      });
    }
  }

  async create(req, res) {
    /*
    #swagger.summary = 'create group',
    #swagger.tags = ['User Group'],
    #swagger.description = 'Adicionar um grupo.',

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
      const newGroup = await UserGroup.create(req.body);

      // #swagger.responses[201] = { description: 'Grupo registrado com sucesso' }
      return res.json(newGroup);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async show(req, res) {
    /*
    #swagger.summary = 'read group',
    #swagger.tags = ['User Group'],
    #swagger.description = 'Obter um grupo.',
    #swagger.parameters['id'] = {
      description: 'ID do grupo.',
      type: 'integer'
    }
    */

    try {
      const group = await UserGroup.findByPk(req.params.id);

      /*
      #swagger.responses[200] = {
        schema: { $ref: "#/definitions/UserGroup" },
        description: 'Grupo encontrado.'
      }
      */
      return res.json(group);
    } catch (e) {
      return res.status(400).json({
        errors: [e.message],
      });
    }
  }

  async update(req, res) {
    /*
    #swagger.summary = 'update group',
    #swagger.tags = ['User Group'],
    #swagger.description = 'Atualizar um grupo.',

    #swagger.parameters['id'] = {
      description: 'ID do grupo.',
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
      if (Number(req.params.id) === 1) {
        return res.status(400).json({
          errors: ['Não é permitido alterar o grupo de usuário Administrador'],
        });
      }

      const group = await UserGroup.findByPk(req.params.id);

      if (!group) {
        return res.status(400).json({
          errors: ['O grupo de usuário não existe'],
        });
      }

      const newData = await group.update(req.body);

      // #swagger.responses[200] = { description: 'Grupo atualizado com sucesso' }
      return res.json(newData);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async delete(req, res) {
    /*
    #swagger.summary = 'delete group',
    #swagger.tags = ['User Group'],
    #swagger.description = 'Remover um grupo.',

    #swagger.parameters['id'] = {
      description: 'ID do grupo.',
      type: 'integer'
    }
    */

    try {
      if (Number(req.params.id) === 1) {
        return res.status(400).json({
          errors: ['Não é permitido deletar o grupo de usuário Administrador'],
        });
      }

      const group = await UserGroup.findByPk(req.params.id);

      if (!group) {
        return res.status(400).json({
          errors: ['O grupo de usuário não existe'],
        });
      }

      await group.destroy();

      // #swagger.responses[200] = { description: 'Grupo removido com sucesso' }
      return res.json(group);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
}

export default new UserGroupController();
