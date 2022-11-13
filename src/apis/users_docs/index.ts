// const controller = require("../controllers/userController.js");
import * as controller from 'src/apis/users_docs/controller'
import { Router } from 'express';
import { endpoints } from 'config/index';
import resolve_route from 'src/helpers/resolve_route';
import authentication, { right_owner, right_user } from 'src/middlewares/authentication';

const userDocsEndpoint = endpoints.userDocs;
const router: Router = Router();


// router.use(authentication);

// Create a new user doc
router.post(resolve_route(userDocsEndpoint.create), authentication, controller.create);

// List users docs
router.get(resolve_route(userDocsEndpoint.list), authentication, controller.findAll);

// Retrieve user doc
router.get(resolve_route(userDocsEndpoint.retrive), authentication, right_owner({ entity: 'users_docs' }), controller.findOne);

// Retrieve user docs by user
router.get(resolve_route(userDocsEndpoint.retriveByUser), authentication, controller.findByUser);

// Update a user doc
router.put(resolve_route(userDocsEndpoint.update), authentication, right_owner({ entity: 'users_docs' }), controller.update);

// Delete a user doc
router.delete(resolve_route(userDocsEndpoint.delete), authentication, right_owner({ entity: 'users_docs' }), controller.remove);

// Delete a user docs
// router.delete(resolve_route(userDocsEndpoint.deleteByUser), authentication, right_owner({ entity: 'users_docs' }), controller.removeByUser);

// // Purge users
router.delete(resolve_route(userDocsEndpoint.purge), authentication, controller.removeAll);

export default router;

