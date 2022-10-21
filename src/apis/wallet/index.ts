// const controller = require("../controllers/userController.js");
import * as controller from 'src/apis/wallet/controller'
import { Router } from 'express';
import { endpoints } from 'config/index';
import resolve_route from 'src/helpers/resolve_route';

const walletEndpoint = endpoints.wallet;
const router: Router = Router();
// var router = require("express").Router();

// // Create a new wallet
router.post(resolve_route(walletEndpoint.create), controller.create);

// // List wallet
router.get(resolve_route(walletEndpoint.list), controller.findAll);

// Retrieve wallet
router.get(resolve_route(walletEndpoint.retrive), controller.findOne);

// Retrieve wallet by user
router.get(resolve_route(walletEndpoint.retriveByUser), controller.findByUser);

// // Update a wallet
router.put(resolve_route(walletEndpoint.update), controller.update);

// // Delete a wallet
router.delete(resolve_route(walletEndpoint.delete), controller.remove);

// // Delete a wallet by user
router.delete(resolve_route(walletEndpoint.deleteByUser), controller.removeByUser);

// // Purge wallet
router.delete(resolve_route(walletEndpoint.purge), controller.removeAll);

export default router;

