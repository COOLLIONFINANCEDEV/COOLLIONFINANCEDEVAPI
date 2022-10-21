import cors from "cors";
import express from "express";

import * as config from 'config/index';
import router from 'src/apis'
import resolve_route from "./helpers/resolve_route";

const app: express.Application = express();

app.use(cors(config.corsAllowOrigin)); // allow cors 
app.use(express.json()); // parse requests body on json format
app.use(express.json()); // parse requests of content-type - application/json
app.use(express.urlencoded({ extended: true })); // parse requests of content-type - application/x-www-form-urlencoded

app.use(resolve_route(config.endpoints.baseUrl), router.userRoute);
app.use(resolve_route(config.endpoints.baseUrl), router.companyRoute);
app.use(resolve_route(config.endpoints.baseUrl), router.offerRoute);

export default app;