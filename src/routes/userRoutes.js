import { Router } from 'express';
import userController from '../controllers/UserController';
import loginRequired from '../middlewares/loginRequired';
import pagination from '../middlewares/pagination';
import { EnumRoutes } from '../utils/permissions';

const router = new Router();

router.use(loginRequired(EnumRoutes.USER));
router.get('/', pagination, userController.index);
router.get('/:id', userController.show);
router.post('/', userController.create);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);

export default router;
