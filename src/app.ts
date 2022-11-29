// with express.js

import cors from "cors";
import express, { NextFunction, Request, Response } from "express";

import * as config from 'config/index';
import router from 'src/apis'
import resolve_route from "src/helpers/resolve_route";
import error_404 from "src/middlewares/error_404";
import perform_query_parameter from "./middlewares/support_dot_map_query_parameter";

const app: express.Application = express();

app.use(cors(config.corsAllowOrigin)); // allow cors 
app.use(express.json()); // parse requests body on json format
app.use(express.json()); // parse requests of content-type - application/json
app.use(express.urlencoded({ extended: true })); // parse requests of content-type - application/x-www-form-urlencoded
app.use(perform_query_parameter); // allow query parameter to support dot map structure notation like /d?age.gt=50&age.lt=18

app.use(resolve_route(config.endpoints.baseUrl), router.userRoute);
app.use(resolve_route(config.endpoints.baseUrl), router.usersDocsRoute);
app.use(resolve_route(config.endpoints.baseUrl), router.roleRoute);
app.use(resolve_route(config.endpoints.baseUrl), router.permissionsRoute);
app.use(resolve_route(config.endpoints.baseUrl), router.walletRoute);
app.use(resolve_route(config.endpoints.baseUrl), router.transactionsRoute);
app.use(resolve_route(config.endpoints.baseUrl), router.companyRoute);
app.use(resolve_route(config.endpoints.baseUrl), router.offerRoute);
app.use(resolve_route(config.endpoints.baseUrl), router.offerDocsRoute);
app.use(resolve_route(config.endpoints.baseUrl), router.offerRepaymentPlanRoute);
app.use(resolve_route(config.endpoints.baseUrl), router.investmentRoute);
app.use(resolve_route(config.endpoints.baseUrl), router.authRoute);
app.use(resolve_route(config.endpoints.baseUrl), router.searchEngine);


// Response of undefined route middleware
app.all("*", (req: Request, res: Response, next: NextFunction) => {
    error_404(false, res, "Url Not Found!");

    next()
});

export default app;