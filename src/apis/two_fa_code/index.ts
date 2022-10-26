// const controller = require("../controllers/userController.js");
import * as controller from 'src/apis/two_fa_code/controller'
import { Router } from 'express';
import { endpoints } from 'config/index';
import resolve_route from 'src/helpers/resolve_route';

const twoFACodeEndpoint = endpoints.twoFACode;
const router: Router = Router();

// Send a  sms: we got user_id and channel like email , sms, voice or totp
// Authentication needed to access this endpoint
router.post(resolve_route(twoFACodeEndpoint.send), controller.send);

// Validate token: we got got token, user_id
// Authentication needed to access this endpoint
router.post(resolve_route(twoFACodeEndpoint.check), controller.check);

// Retrieve user
// router.post(resolve_route(twoFACodeEndpoint.validate), controller.validate);

export default router;

