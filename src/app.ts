import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './utils/error.middleware';
import { notFoundHandler } from './utils/not-found.middleware';
import authRouter from './routes/auth.route';
import userRouter from './routes/user.route';
import tenantRouter from './routes/tenant.route';
import roleRouter from './routes/role.route';
import projectRouter from './routes/project.route';
import walletRouter from './routes/wallet.route';
import paymentMethodRouter from './routes/payment-method.route';
import investmentRouter from './routes/investment.route';
import transactionRouter from './routes/transaction.route';
import invitationRouter from './routes/invitation.route';
import userTenantRouter from './routes/user-tenant.route';
import { app as appConfig } from './configs/app.conf';
import { getClientInfo } from './utils/get-client-info.middleware';


const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(getClientInfo);

const baseRoute = `/${appConfig.version}`;

app.use(baseRoute, authRouter);
app.use(baseRoute, userRouter);
app.use(baseRoute, tenantRouter);
app.use(baseRoute, roleRouter);
app.use(baseRoute, projectRouter);
app.use(baseRoute, walletRouter);
app.use(baseRoute, paymentMethodRouter);
app.use(baseRoute, investmentRouter);
app.use(baseRoute, transactionRouter);
app.use(baseRoute, invitationRouter);
app.use(baseRoute, userTenantRouter);

app.use(errorHandler);
app.use(notFoundHandler);

export default app;