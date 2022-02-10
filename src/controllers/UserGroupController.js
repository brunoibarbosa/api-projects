import UserGroup from '../models/UserGroup';

class UserGroupController {
  async index(req, res) {
    try {
      const groups = await UserGroup.findAll({ ...res.locals.pagination });
      return res.json(groups);
    } catch (e) {
      return res.json({
        errors: [e.message],
      });
    }
  }

  async create(req, res) {
    try {
      const newGroup = await UserGroup.create(req.body);
      return res.json(newGroup);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async show(req, res) {
    try {
      const group = await UserGroup.findByPk(req.params.id);
      return res.json(group);
    } catch (e) {
      return res.json({
        errors: [e.message],
      });
    }
  }

  async update(req, res) {
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
      return res.json(newData);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async delete(req, res) {
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
      return res.json(group);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
}

export default new UserGroupController();
