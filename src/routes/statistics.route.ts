import express from 'express';
import { statistics as endpoints } from '../configs/endpoints.conf';
import * as controller from '../controllers/statistics.controller';
import { authenticate, authorize } from '../utils/auth.middleware';

const router = express.Router();
const {  statistics } = endpoints;

router[statistics.method](statistics.path, authenticate, authorize(statistics.authorizationRules), controller.statistics);

export default router;
