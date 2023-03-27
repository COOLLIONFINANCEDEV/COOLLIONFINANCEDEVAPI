import express from 'express';
import { wallet as endpoints } from '../configs/endpoints.conf';
import { authenticate, authorize } from '../utils/auth.middleware';
import * as controller from '../controllers/wallet.controller';

const router = express.Router();
const { register, retrive } = endpoints;

router[retrive.method](retrive.path, authenticate, authorize(retrive.authorizationRules), controller.retrive);
router[register.method](register.path, authenticate, authorize(register.authorizationRules), controller.register);

export default router;
