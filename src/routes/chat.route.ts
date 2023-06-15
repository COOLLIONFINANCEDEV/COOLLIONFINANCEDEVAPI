import express from 'express';
import { chat as endpoints } from '../configs/endpoints.conf';
import { authenticate, authorize } from '../utils/auth.middleware';
import { validator } from '../utils/validator.middleware';
import * as controller from '../controllers/chat.controller';

const router = express.Router();
const { post, history, remove, retriveRoom, listRoom } = endpoints;

router[listRoom.method](listRoom.path, authenticate, authorize(retriveRoom.authorizationRules), controller.listRoom);
router[retriveRoom.method](retriveRoom.path, authenticate, authorize(retriveRoom.authorizationRules), controller.retriveRoom);
router[history.method](history.path, authenticate, authorize(history.authorizationRules), controller.history);
router[remove.method](remove.path, authenticate, authorize(remove.authorizationRules), controller.remove);
router[post.method](post.path, authenticate, authorize(post.authorizationRules), validator(post.schema), controller.post);

export default router;
