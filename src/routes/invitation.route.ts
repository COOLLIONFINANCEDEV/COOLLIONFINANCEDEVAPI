import express from 'express';
import { invitation as endpoints } from '../configs/endpoints.conf';
import { authenticate, authorize } from '../utils/auth.middleware';
import { validator } from '../utils/validator.middleware';
import * as controller from '../controllers/invitation.controller';

const router = express.Router();
const { invite, confirm, remove, list } = endpoints;

router[list.method](list.path, authenticate, authorize(list.authorizationRules), controller.list);
router[remove.method](remove.path, authenticate, authorize(remove.authorizationRules), controller.remove);
router[confirm.method](confirm.path, authenticate, authorize(confirm.authorizationRules), validator(confirm.schema), controller.confirm);
router[invite.method](invite.path, authenticate, authorize(invite.authorizationRules), validator(invite.schema), controller.invite);

export default router;
