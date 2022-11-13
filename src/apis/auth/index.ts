// const controller = require("../controllers/userController.js");
import * as controller from 'src/apis/auth/controller'
import { Router } from 'express';
import { endpoints } from 'config/index';
import resolve_route from 'src/helpers/resolve_route';

const authEndpoint = endpoints.auth;
const router: Router = Router();
// var router = require("express").Router();

// signin with email + contact(optional)
router.post(resolve_route(authEndpoint.signup), controller.signup);


// login with email/contact + password
router.post(resolve_route(authEndpoint.signin), controller.signin);


// List users
router.post(resolve_route(authEndpoint.getAccessToken), controller.getAccessToken);


// Retrieve user
router.post(resolve_route(authEndpoint.refreshAccessToken), controller.refreshAccessToken);


// Reset password (verify user)
router.post(resolve_route(authEndpoint.resetPasswordVerify), controller.resetPasswordVerify);


// Reset password
router.post(resolve_route(authEndpoint.resetPasswordReset), controller.resetPasswordReset);


// Send a message: we got user_id and channel like email , sms, voice or totp
router.post(resolve_route(authEndpoint.twoFAVerify), controller.twoFAVerify);


// Validate token: we got got token, user_id
router.post(resolve_route(authEndpoint.twoFACheck), controller.twoFACheck);


router.post(resolve_route(authEndpoint.verifyUserInfo), controller.verifyUserInfo);


router.post(resolve_route(authEndpoint.checkVerification), controller.checkVerification);

export default router;


