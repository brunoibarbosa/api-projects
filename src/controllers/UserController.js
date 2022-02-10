import User from '../models/User';
import UserGroup from '../models/UserGroup';

class UserController {
  async index(req, res) {
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
      return res.json(users);
    } catch (e) {
      return res.json({
        errors: [e.message],
      });
    }
  }

  async create(req, res) {
    try {
      const newUser = await User.create(req.body);
      const {
        id, name, email, group_id, created_at, updated_at,
      } = newUser;
      return res.json({
        id, name, email, group_id, created_at, updated_at,
      });
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async show(req, res) {
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
      return res.json(user);
    } catch (e) {
      return res.json({
        errors: [e.message],
      });
    }
  }

  async update(req, res) {
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
