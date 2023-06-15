import express from 'express';
import { accountTypes as endpoints } from '../configs/endpoints.conf';
import * as controller from '../controllers/account-types.controller';
import { authenticate, authorize } from '../utils/auth.middleware';
import { validator } from '../utils/validator.middleware';

const router = express.Router();
const { register, update, retrive, list } = endpoints;

router[list.method](list.path, authenticate, authorize(list.authorizationRules), controller.list);
router[retrive.method](retrive.path, authenticate, authorize(retrive.authorizationRules), controller.retrive);
router[update.method](update.path, authenticate, authorize(update.authorizationRules), validator(update.schema), controller.update);
router[register.method](register.path, authenticate, authorize(register.authorizationRules), validator(register.schema), controller.register);

export default router;
