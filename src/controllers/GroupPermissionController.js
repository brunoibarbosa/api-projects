import GroupPermission from '../models/GroupPermission';

class GroupPermissionController {
  async create(req, res) {
    try {
      const reqBody = { ...req.body, group_id: req.params.group_id };
      const newPermission = await GroupPermission.create(reqBody);
      return res.json(newPermission);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async show(req, res) {
    try {
      const objWhere = { group_id: req.params.group_id };
      if (Number(req.body.route_number) > 0) {
        objWhere.route_number = req.body.route_number;
      }
      const permission = await GroupPermission.findAll({
        attributes: { exclude: ['group_id'] },
        where: objWhere,
      });
      return res.json(permission);
    } catch (e) {
      return res.json({
        errors: [e.message],
      });
    }
  }

  async update(req, res) {
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
