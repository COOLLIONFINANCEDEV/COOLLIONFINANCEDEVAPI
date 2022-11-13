import userRoute from 'apis/users';
import usersDocsRoute from 'apis/users_docs';
import roleRoute from 'apis/role';
import permissionsRoute from 'apis/permissions';
import walletRoute from 'apis/wallet';
import transactionsRoute from 'src/apis/transaction';
import companyRoute from 'apis/company';
import offerRoute from 'apis/offer';
import offerDocsRoute from 'apis/offer_docs';
import offerRepaymentPlanRoute from 'apis/offer_repayment_plan';
import investmentRoute from 'apis/investment';
import authRoute from 'apis/auth';

const router = {
    userRoute: userRoute,
    usersDocsRoute: usersDocsRoute,
    roleRoute: roleRoute,
    permissionsRoute: permissionsRoute,
    walletRoute: walletRoute,
    transactionsRoute: transactionsRoute,
    companyRoute: companyRoute,
    offerRoute: offerRoute,
    offerDocsRoute: offerDocsRoute,
    offerRepaymentPlanRoute: offerRepaymentPlanRoute,
    investmentRoute: investmentRoute,
    authRoute: authRoute,
};

export default router;