import jwt from 'jsonwebtoken';
import User from '../models/User';
import UserGroup from '../models/UserGroup';

class TokenController {
  async create(req, res) {
    const { email = '', password = '' } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        errors: ['Informe o email e senha'],
      });
    }

    const user = await User.findOne({
      where: {
        email,
      },
      include: {
        attributes: ['id', 'description'],
        model: UserGroup,
        as: 'group',
      },
    });

    if (!user || (!(await user.passwordIsValid(password)))) {
      return res.status(401).json({
        errors: ['Email e/ou senha incorretas'],
      });
    }

    const infoUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      group: {
        id: user.group.id,
        description: user.group.description,
      },
    };
    const token = jwt.sign({ user: infoUser }, process.env.TOKEN_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRATION,
    });

    return res.json({
      token,
      user: infoUser,
    });
  }
}

export default new TokenController();
