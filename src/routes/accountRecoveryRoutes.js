import { Router } from 'express';
import accountRecoveryController from '../controllers/AccountRecoveryController';

const router = new Router();

router.get('/:token', accountRecoveryController.show);
router.post('/', accountRecoveryController.create);
router.put('/:token', accountRecoveryController.recovery);

export default router;
