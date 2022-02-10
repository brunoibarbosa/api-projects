import { Router } from 'express';
import projectController from '../controllers/ProjectController';
import loginRequired from '../middlewares/loginRequired';
import pagination from '../middlewares/pagination';
import { EnumRoutes } from '../utils/permissions';

const router = new Router();
const routeNumber = EnumRoutes.PROJECT;

router.get('/', pagination, projectController.index);
router.get('/:id', projectController.show);
router.post('/', loginRequired(routeNumber), projectController.create);
router.put('/:id', loginRequired(routeNumber), projectController.update);
router.delete('/:id', loginRequired(routeNumber), projectController.delete);

export default router;
