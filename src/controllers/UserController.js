import User from '../models/User';
import UserGroup from '../models/UserGroup';

class UserController {
  async index(req, res) {
    /*
    #swagger.summary = 'read all users',
    #swagger.tags = ['User'],
    #swagger.description = 'Obter todos os usuários. Acessível apenas por usuários logados.',

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
      const users = await User.findAll({
        attributes: { exclude: ['password_hash', 'group_id'] },
        include: {
          attributes: ['id', 'description'],
          model: UserGroup,
          as: 'group',
        },
        ...res.locals.pagination,
      });

      /*
      #swagger.responses[200] = {
        schema: [{$ref: '#/definitions/User'}],
        description: 'Usuários encontrados.'
      }
      */
      return res.json(users);
    } catch (e) {
      return res.status(400).json({
        errors: [e.message],
      });
    }
  }

  async create(req, res) {
    /*
    #swagger.summary = 'create user',
    #swagger.tags = ['User'],
    #swagger.description = 'Adicionar um usuário. Acessível apenas por usuários logados.',

    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Informações do usuário.',
      required: true,
      schema: {
        name: 'string',
        email: 'user@mail.com',
        password: 'string',
        active: true,
        group_id: 0,
      }
    }
    */

    try {
      const newUser = await User.create(req.body);
      const {
        id, name, email, group_id, created_at, updated_at,
      } = newUser;

      /*
      #swagger.responses[201] = {
        schema: {
          id: 0,
          name: 'string',
          email: 'user@mail.com',
          group_id: 0,
          created_at: '2022-01-00T00:00:00.000Z0',
          updated_at: '2022-01-00T00:00:00.000Z0'
        },
        description: 'Usuário registrado com sucesso'
      }
      */
      return res.status(201).json({
        id, name, email, group_id, created_at, updated_at,
      });
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async show(req, res) {
    /*
    #swagger.summary = 'read user',
    #swagger.tags = ['User'],
    #swagger.description = 'Obter um usuário. Acessível apenas por usuários logados.',
    #swagger.parameters['id'] = {
      description: 'ID do usuário.',
      type: 'integer'
    }
    */

    try {
      const user = await User.findOne({
        attributes: { exclude: ['password_hash', 'group_id'] },
        where: {
          id: req.params.id,
        },
        include: {
          attributes: ['id', 'description'],
          model: UserGroup,
          as: 'group',
        },
      });

      /*
      #swagger.responses[200] = {
        schema: { $ref: "#/definitions/User" },
        description: 'Usuário encontrado.'
      }
      */
      return res.json(user);
    } catch (e) {
      return res.status(400).json({
        errors: [e.message],
      });
    }
  }

  async update(req, res) {
    /*
    #swagger.summary = 'update user',
    #swagger.tags = ['User'],
    #swagger.description = 'Atualizar um usuário. Acessível apenas por usuários logados.',

    #swagger.parameters['id'] = {
      description: 'ID do usuário.',
      type: 'integer'
    }

    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Informações do usuário.',
      required: true,
      schema: {
        name: 'string',
        email: 'user@mail.com',
        password: 'string',
        active: true,
        group_id: 0,
      }
    }
    */

    try {
      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(400).json({
          errors: ['O usuário não existe'],
        });
      }

      let reqBody;
      if (Number(req.params.id) === 1) {
        reqBody = {
          id: req.body.id,
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        };
      } else { reqBody = req.body; }

      const newData = await user.update(reqBody);
      const {
        id, name, email, active, group_id, created_at, updated_at,
      } = newData;

      /*
      #swagger.responses[200] = {
        schema: {
          id: 0,
          name: 'string',
          email: 'user@mail.com',
          active: true,
          group_id: 0,
          created_at: '2022-01-00T00:00:00.000Z0',
          updated_at: '2022-01-00T00:00:00.000Z0'
        },
        description: 'Usuário atualizado com sucesso'
      }
      */
      return res.json({
        id, name, email, active, group_id, created_at, updated_at,
      });
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async delete(req, res) {
    /*
    #swagger.summary = 'delete user',
    #swagger.tags = ['User'],
    #swagger.description = 'Remover um usuário. Acessível apenas por usuários logados.',

    #swagger.parameters['id'] = {
      description: 'ID do usuário.',
      type: 'integer'
    }
    */

    try {
      if (Number(req.params.id) === 1) {
        return res.status(400).json({
          errors: ['Não é permitido deletar o usuário Administrador'],
        });
      }

      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(400).json({
          errors: ['O usuário não existe'],
        });
      }

      await user.destroy();
      const {
        id, name, email, active, group_id, created_at, updated_at,
      } = user;

      /*
      #swagger.responses[200] = {
        schema: {
          id: 0,
          name: 'string',
          email: 'user@mail.com',
          active: true,
          group_id: 0,
          created_at: '2022-01-00T00:00:00.000Z0',
          updated_at: '2022-01-00T00:00:00.000Z0'
        },
        description: 'Usuário removido com sucesso'
      }
      */
      return res.json({
        id, name, email, active, group_id, created_at, updated_at,
      });
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
}

export default new UserController();
