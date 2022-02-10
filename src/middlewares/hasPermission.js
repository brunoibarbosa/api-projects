import jwt from 'jsonwebtoken';
import GroupPermission from '../models/GroupPermission';

export default async (req, res, next) => {
  const { authorization } = req.headers;
  const [, token] = authorization.split(' ');

  try {
    const data = jwt.verify(token, process.env.TOKEN_SECRET);
    const group_id = data.user.group.id;

    if (group_id !== 1) {
      const permissions = await GroupPermission.findOne({
        where: {
          group_id,
          route_number: res.locals.routeNumber,
        },
      });

      const hasPermission = () => {
        switch (req.method) {
          case 'POST': return permissions.can_create;
          case 'GET': return permissions.can_read;
          case 'UPDATE': return permissions.can_update;
          case 'DELETE': return permissions.can_delete;
          default: return false;
        }
      };

      if (!permissions || !hasPermission()) {
        return res.status(401).json({
          errors: ['O usuário não tem permissão de acesso'],
        });
      }
    }

    return next();
  } catch (e) {
    return res.status(401).json({
      errors: [e.message],
    });
  }
};
