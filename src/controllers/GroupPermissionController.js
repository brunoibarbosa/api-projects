import GroupPermission from '../models/GroupPermission';

class GroupPermissionController {
  async create(req, res) {
    /*
    #swagger.summary = 'create permissions',
    #swagger.tags = ['User Group Permission'],
    #swagger.description = 'Adicionar permissões para o grupo de usuário.',

    #swagger.parameters['group_id'] = {
      description: 'ID do Grupo.',
      type: 'integer'
    },

    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Informações das permissões.',
      required: true,
      schema: {
        route_number: 0,
        can_create: true,
        can_read: false,
        can_update: false,
        can_delete: true,
      }
    }
    */

    try {
      const reqBody = { ...req.body, group_id: req.params.group_id };
      const newPermission = await GroupPermission.create(reqBody);

      /*
      #swagger.responses[201] = {
        schema: {
          id: 0,
          group_id: 0,
          route_number: 0,
          can_create: true,
          can_read: false,
          can_update: true,
          can_delete: true,
          created_at: '2022-01-01T00:00:00.000Z',
          updated_at: '2022-01-01T00:00:00.000Z',
        },
        description: 'Permissões registradas com sucesso'
      }
      */
      return res.json(newPermission);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async show(req, res) {
    /*
    #swagger.summary = 'read permissions',
    #swagger.tags = ['User Group Permission'],
    #swagger.description = 'Obter as permissões de um grupo de usuário.',
    #swagger.parameters['group_id'] = {
      description: 'ID do grupo.',
      type: 'integer'
    }
    */

    try {
      const objWhere = { group_id: req.params.group_id };
      if (Number(req.body.route_number) > 0) {
        objWhere.route_number = req.body.route_number;
      }
      const permission = await GroupPermission.findAll({
        attributes: { exclude: ['group_id'] },
        where: objWhere,
      });

      /*
      #swagger.responses[200] = {
        schema: [{ $ref: "#/definitions/Permissions" }],
        description: 'Permissões encontradas.'
      }
      */
      return res.json(permission);
    } catch (e) {
      return res.status(400).json({
        errors: [e.message],
      });
    }
  }

  async update(req, res) {
    /*
    #swagger.summary = 'update permissions',
    #swagger.tags = ['User Group Permission'],
    #swagger.description = 'Atualizar as permissões de um grupo de usuário.',

    #swagger.parameters['group_id'] = {
      description: 'ID do grupo.',
      type: 'integer'
    }

    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Informações das permissões.',
      required: true,
      schema: {
        route_number: 0,
        can_create: true,
        can_read: false,
        can_update: false,
        can_delete: true,
      }
    }
    */

    try {
      if (Number(req.params.group_id) === 1) {
        return res.status(400).json({
          errors: ['Não é permitido alterar as permissões do grupo de usuário Administrador'],
        });
      }

      const permission = await GroupPermission.findOne({
        where: {
          group_id: req.params.group_id,
          route_number: req.body.route_number,
        },
      });

      if (!permission) {
        return res.status(400).json({
          errors: ['A permissão do grupo informado não existe'],
        });
      }

      /*
      #swagger.responses[200] = {
        schema: {
          id: 0,
          group_id: 0,
          route_number: 0,
          can_create: true,
          can_read: false,
          can_update: true,
          can_delete: true,
          created_at: '2022-01-01T00:00:00.000Z',
          updated_at: '2022-01-01T00:00:00.000Z',
        },
        description: 'Permissões atualizadas com sucesso'
      }
      */
      const newData = await permission.update(req.body);
      return res.json(newData);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
}

export default new GroupPermissionController();
