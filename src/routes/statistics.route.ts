import express from 'express';
import { statistics as endpoints } from '../configs/endpoints.conf';
import * as controller from '../controllers/statistics.controller';
import { authenticate } from '../utils/auth.middleware';

const router = express.Router();
const {  statistics } = endpoints;

router[statistics.method](statistics.path, /*authenticate,*/ controller.statistics);

export default router;
