import express from 'express';
import { transaction as endpoints } from '../configs/endpoints.conf';
import * as controller from '../controllers/transaction.controller';
import { authenticate, authorize } from '../utils/auth.middleware';
import { validator } from '../utils/validator.middleware';

const router = express.Router();
const { makeDeposit, retrive, list, listOther, syncCinetpayPayment } = endpoints;

router[listOther.method](listOther.path, authenticate, authorize(listOther.authorizationRules), controller.list);
router[list.method](list.path, authenticate, authorize(list.authorizationRules), controller.list);
router[retrive.method](retrive.path, authenticate, authorize(retrive.authorizationRules), controller.retrive);
router[makeDeposit.method](makeDeposit.path, authenticate, authorize(makeDeposit.authorizationRules), validator(makeDeposit.schema), controller.makeDeposit);
router[syncCinetpayPayment.method](syncCinetpayPayment.path, controller.syncCinetpayPayment);
// ping cinetpay payments synchronization url
router.get(syncCinetpayPayment.path, controller.syncCinetpayPayment);
export default router;
