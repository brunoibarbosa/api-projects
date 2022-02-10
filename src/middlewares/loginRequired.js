import jwt from 'jsonwebtoken';
import User from '../models/User';
import hasPermission from './hasPermission';

export default (routeNumber) => async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      errors: ['É necessário realizar o login'],
    });
  }

  const [, token] = authorization.split(' ');

  try {
    const data = jwt.verify(token, process.env.TOKEN_SECRET);
    const { id, email } = data.user;

    const user = await User.findOne({
      where: {
        id,
        email,
      },
    });

    if (!user) {
      return res.status(401).json({
        errors: ['Usuário inválido'],
      });
    }

    if (!user.active) {
      return res.status(401).json({
        errors: ['O usuário está inativo'],
      });
    }

    req.userId = id;
    req.userEmail = email;
    res.locals.routeNumber = routeNumber;
    return hasPermission(req, res, next);
  } catch (e) {
    return res.status(401).json({
      errors: ['Token expirado ou inválido'],
    });
  }
};
