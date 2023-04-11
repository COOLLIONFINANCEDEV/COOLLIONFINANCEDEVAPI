import express from 'express';
import { userTenant as endpoints } from '../configs/endpoints.conf';
import { authenticate, authorize } from '../utils/auth.middleware';
import { validator } from '../utils/validator.middleware';
import * as controller from '../controllers/user-tenant.controller';

const router = express.Router();
const { grantRole, removeMember, removeMemberRole, retrive, list  } = endpoints;

router[list.method](list.path, authenticate, authorize(list.authorizationRules), controller.list);
router[retrive.method](retrive.path, authenticate, authorize(retrive.authorizationRules), controller.retrive);
router[removeMemberRole.method](removeMemberRole.path, authenticate, authorize(removeMemberRole.authorizationRules), controller.removeMemberRole);
router[removeMember.method](removeMember.path, authenticate, authorize(removeMember.authorizationRules), controller.removeMember);
router[grantRole.method](grantRole.path, authenticate, authorize(grantRole.authorizationRules), validator(grantRole.schema), controller.grantRole);

export default router;
