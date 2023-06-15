import express from 'express';
import { user as endpoints } from '../configs/endpoints.conf';
import { authenticate, authorize } from '../utils/auth.middleware';
import { validator } from '../utils/validator.middleware';
import * as controller from '../controllers/user.controller';

const router = express.Router();
const { update, remove, retrive, retriveOther, list } = endpoints;

router[list.method](list.path, authenticate, authorize(list.authorizationRules), controller.list);
router[retriveOther.method](retriveOther.path, authenticate, authorize(retriveOther.authorizationRules), controller.retrive);
router[retrive.method](retrive.path, authenticate, authorize(retrive.authorizationRules), controller.retrive);
router[remove.method](remove.path, authenticate, authorize(remove.authorizationRules), controller.remove);
router[update.method](update.path, authenticate, authorize(update.authorizationRules), validator(update.schema), controller.update);

export default router;
