// const controller = require("../controllers/userController.js");
import * as controller from 'src/apis/users_docs/controller'
import { Router } from 'express';
import { endpoints } from 'config/index';
import resolve_route from 'src/helpers/resolve_route';

const userDocsEndpoint = endpoints.userDocs;
const router: Router = Router();
// var router = require("express").Router();

// Create a new user doc
router.post(resolve_route(userDocsEndpoint.create), controller.create);

// List users docs
router.get(resolve_route(userDocsEndpoint.list), controller.findAll);

// Retrieve user doc
router.get(resolve_route(userDocsEndpoint.retrive), controller.findOne);

// Retrieve user docs 
router.get(resolve_route(userDocsEndpoint.retriveByUser), controller.findByUser);

// Update a user doc
router.put(resolve_route(userDocsEndpoint.update), controller.update);

// Delete a user doc
router.delete(resolve_route(userDocsEndpoint.delete), controller.remove);

// Delete a user docs
router.delete(resolve_route(userDocsEndpoint.deleteByUser), controller.removeByUser);

// // Purge users
router.delete(resolve_route(userDocsEndpoint.purge), controller.removeAll);

export default router;

