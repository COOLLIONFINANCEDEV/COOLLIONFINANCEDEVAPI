import express from 'express';
import { investment as endpoints } from '../configs/endpoints.conf';
import * as controller from '../controllers/investment.controller';
import { authenticate, authorize } from '../utils/auth.middleware';

const router = express.Router();
const { invest, retrive, list, listByProject } = endpoints;

router[listByProject.method](listByProject.path, authenticate, authorize(listByProject.authorizationRules), controller.list);
router[list.method](list.path, authenticate, authorize(list.authorizationRules), controller.list);
router[retrive.method](retrive.path, authenticate, authorize(retrive.authorizationRules), controller.retrive);
router[invest.method](invest.path, authenticate, authorize(invest.authorizationRules), controller.invest);

export default router;
