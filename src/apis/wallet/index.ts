// const controller = require("../controllers/userController.js");
import * as controller from 'src/apis/wallet/controller'
import { Router } from 'express';
import { endpoints } from 'config/index';
import resolve_route from 'src/helpers/resolve_route';
import authentication, { right_owner } from 'src/middlewares/authentication';

const walletEndpoint = endpoints.wallet;
const router: Router = Router();
// var router = require("express").Router();

// // Create a new wallet
router.post(resolve_route(walletEndpoint.create), authentication, controller.create);

// // List wallet
router.get(resolve_route(walletEndpoint.list), authentication, controller.findAll);

// Retrieve wallet
router.get(resolve_route(walletEndpoint.retrive), authentication, right_owner({ entity: "wallet" }), controller.findOne);

// Retrieve wallet by user
router.get(resolve_route(walletEndpoint.retriveByUser), authentication, controller.findByUser);

// // Update a wallet
router.put(resolve_route(walletEndpoint.update), authentication, right_owner({ entity: "wallet" }), controller.update);

// // Delete a wallet
router.delete(resolve_route(walletEndpoint.delete), authentication, right_owner({ entity: "wallet" }), controller.remove);

// // Delete a wallet by user
// router.delete(resolve_route(walletEndpoint.deleteByUser), authentication, controller.removeByUser);

// // Purge wallet
router.delete(resolve_route(walletEndpoint.purge), authentication, controller.removeAll);

export default router;

