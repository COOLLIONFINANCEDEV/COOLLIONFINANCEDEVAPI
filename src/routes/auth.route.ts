import express from 'express';
import { auth as endpoints } from '../configs/endpoints.conf';
import * as controller from '../controllers/auth.controller';
import { authenticate, authorize } from '../utils/auth.middleware';
import { validator } from '../utils/validator.middleware';

const router = express.Router();
const { register, login, refreshToken, changePassword } = endpoints;

router.post(changePassword.path, authenticate, authorize(changePassword.authorizationRules), validator(changePassword.schema), controller.changePassword);
router.post(refreshToken.path, validator(refreshToken.schema), controller.refreshToken);
router.post(login.path, validator(login.schema), controller.login);
router.post(register.path, validator(register.schema), controller.register);

export default router;
