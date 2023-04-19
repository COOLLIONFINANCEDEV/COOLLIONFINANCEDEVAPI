import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { app as appConfig } from './configs/app.conf';
import accountTypesRouter from './routes/account-types.route';
import authRouter from './routes/auth.route';
import chatRouter from './routes/chat.route';
import investmentTermRouter from './routes/investment-term.route';
import investmentRouter from './routes/investment.route';
import invitationRouter from './routes/invitation.route';
import paymentMethodRouter from './routes/payment-method.route';
import projectRouter from './routes/project.route';
import roleRouter from './routes/role.route';
import tenantRouter from './routes/tenant.route';
import transactionRouter from './routes/transaction.route';
import userTenantRouter from './routes/user-tenant.route';
import userRouter from './routes/user.route';
import walletRouter from './routes/wallet.route';
import { errorHandler } from './utils/error.middleware';
import { getClientInfo } from './utils/get-client-info.middleware';
import { notFoundHandler } from './utils/not-found.middleware';


const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
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
app.use(baseRoute, accountTypesRouter);
app.use(baseRoute, chatRouter);
app.use(baseRoute, investmentTermRouter);

app.use(errorHandler);
app.use(notFoundHandler);

export default app;