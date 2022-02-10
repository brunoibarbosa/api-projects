import { Router } from 'express';
import projectImageController from '../controllers/ProjectImageController';
import loginRequired from '../middlewares/loginRequired';
import { EnumRoutes } from '../utils/permissions';

const router = new Router();

router.use(loginRequired(EnumRoutes.PROJECT_IMAGE));
router.post('/', projectImageController.create);
router.put('/:id', projectImageController.update);
router.delete('/:id', projectImageController.delete);

export default router;
