import { Router } from 'express';
import categoryController from '../controllers/CategoryController';
import loginRequired from '../middlewares/loginRequired';
import pagination from '../middlewares/pagination';
import { EnumRoutes } from '../utils/permissions';

const router = new Router();
const routeNumber = EnumRoutes.CATEGORY;

router.get('/', pagination, categoryController.index);
router.get('/:id', loginRequired(routeNumber), categoryController.show);
router.post('/', loginRequired(routeNumber), categoryController.create);
router.put('/:id', loginRequired(routeNumber), categoryController.update);
router.delete('/:id', loginRequired(routeNumber), categoryController.delete);

export default router;
