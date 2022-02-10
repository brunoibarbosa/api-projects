import { Router } from 'express';
import userGroupController from '../controllers/UserGroupController';
import groupPermissionController from '../controllers/GroupPermissionController';
import loginRequired from '../middlewares/loginRequired';
import pagination from '../middlewares/pagination';
import { EnumRoutes } from '../utils/permissions';

const router = new Router();

router.get('/', pagination, loginRequired(EnumRoutes.USER_GROUP), userGroupController.index);
router.get('/:id', loginRequired(EnumRoutes.USER_GROUP), userGroupController.show);
router.post('/', loginRequired(EnumRoutes.USER_GROUP), userGroupController.create);
router.put('/:id', loginRequired(EnumRoutes.USER_GROUP), userGroupController.update);
router.delete('/:id', loginRequired(EnumRoutes.USER_GROUP), userGroupController.delete);

router.get('/:group_id/permissions', loginRequired(EnumRoutes.GROUP_PERMISSION), groupPermissionController.show);
router.post('/:group_id/permissions', loginRequired(EnumRoutes.GROUP_PERMISSION), groupPermissionController.create);
router.put('/:group_id/permissions', loginRequired(EnumRoutes.GROUP_PERMISSION), groupPermissionController.update);

export default router;
