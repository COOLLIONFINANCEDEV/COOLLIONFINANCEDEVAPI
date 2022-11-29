// const controller = require("../controllers/userController.js");
import * as controller from 'src/apis/search_engine/controller'
import { Router } from 'express';
import { endpoints } from 'config/index';
import resolve_route from 'src/helpers/resolve_route';

const searchEngineEndpoint = endpoints.searchEngine;
const router: Router = Router();
// var router = require("express").Router();


router.get(resolve_route(searchEngineEndpoint.search), controller.search);

export default router;

