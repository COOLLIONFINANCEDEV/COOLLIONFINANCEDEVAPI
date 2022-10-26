// const controller = require("../controllers/userController.js");
import * as controller from 'src/apis/auth/controller'
import { Router } from 'express';
import { endpoints } from 'config/index';
import resolve_route from 'src/helpers/resolve_route';

const authEndpoint = endpoints.auth;
const router: Router = Router();
// var router = require("express").Router();

// // Create a new user
router.post(resolve_route(authEndpoint.login), controller.login);

// // List users
router.post(resolve_route(authEndpoint.getAccessToken), controller.getAccessToken);

// Retrieve user
router.post(resolve_route(authEndpoint.refreshAccessToken), controller.refreshAccessToken);


export default router;

