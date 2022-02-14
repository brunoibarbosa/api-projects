import Str from '@supercharge/strings';
import AccountRecovery from '../models/AccountRecovery';
import User from '../models/User';

class AccountRecoveryController {
  async create(req, res) {
    /*
    #swagger.summary = 'create recovery',
    #swagger.tags = ['Account Recovery'],
    #swagger.description = 'Adicionar recuperação de conta.',

    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Informações da conta.',
      required: true,
      schema: {
        email: 'user@mail.com',
      }
    }
    */

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

      /* #swagger.responses[201] = {
        description: 'Recuperação de conta registrada com sucesso',
        schema: { $ref: "#/definitions/AccountRecovery" },
      }
      */
      return res.json(newAccountRecovery);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async show(req, res) {
    /*
    #swagger.summary = 'read recovery',
    #swagger.tags = ['Account Recovery'],
    #swagger.description = 'Obter uma recuperação de conta.',
    #swagger.parameters['token'] = {
      description: 'Token para a recuperação de conta.',
      type: 'string'
    }
    */

    try {
      const recovery = await AccountRecovery.findOne({
        where: {
          token: req.params.token,
        },
      });

      /*
      #swagger.responses[200] = {
        schema: { $ref: "#/definitions/AccountRecovery" },
        description: 'Recuperação de conta encontrada.'
      }
      */
      return res.json(recovery);
    } catch (e) {
      return res.status(400).json({
        errors: [e.message],
      });
    }
  }

  async recovery(req, res) {
    /*
    #swagger.summary = 'use recovery',
    #swagger.tags = ['Account Recovery'],
    #swagger.description = 'Recuperar uma conta.',

    #swagger.parameters['token'] = {
      description: 'Token para a recuperação de conta.',
      type: 'string'
    }
    */

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

      // #swagger.responses[200] = { description: 'Conta recuperada com sucesso' }
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
