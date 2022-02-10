import Str from '@supercharge/strings';
import AccountRecovery from '../models/AccountRecovery';
import User from '../models/User';

class AccountRecoveryController {
  async create(req, res) {
    try {
      const user = await User.findOne({
        where: {
          email: req.body.email,
        },
      });

      if (!user) {
        return res.status(400).json({
          errors: ['Não existe nenhum usuário com o email informado'],
        });
      }

      const randomToken = `${user.id}${Date.now()}${Str.random(50).replaceAll('-', '0')}`;
      const newAccountRecovery = await AccountRecovery.create({
        user_id: user.id,
        token: randomToken,
      });
      return res.json(newAccountRecovery);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async show(req, res) {
    try {
      const recovery = await AccountRecovery.findOne({
        where: {
          token: req.params.token,
        },
      });
      return res.json(recovery);
    } catch (e) {
      return res.json({
        errors: [e.message],
      });
    }
  }

  async recovery(req, res) {
    try {
      const recovery = await AccountRecovery.findOne({
        where: {
          token: req.params.token,
        },
      });

      if (!recovery) {
        return res.status(400).json({
          errors: ['O token informado não existe'],
        });
      }

      if (!recovery.valid) {
        return res.status(400).json({
          errors: ['O token já foi utilizado ou expirou'],
        });
      }

      const user = await User.findByPk(recovery.user_id);

      if (!user) {
        return res.status(400).json({
          errors: ['O usuário não existe'],
        });
      }

      const { password } = req.body;
      const newData = await user.update({ password });
      const {
        id, name, email, active, group_id,
      } = newData;

      await recovery.update({ used: true });

      return res.json({
        id, name, email, active, group_id,
      });
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
}

export default new AccountRecoveryController();
