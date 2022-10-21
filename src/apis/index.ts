import userRoute from 'apis/users';
import usersDocsRoute from 'apis/users_docs';
import roleRoute from 'apis/role';
import permissionsRoute from 'apis/permissions';
import walletRoute from 'apis/wallet';
import transactionsRoute from 'src/apis/transaction';
import companyRoute from 'apis/company';
import offerRoute from 'apis/offer';

const router = {
    userRoute: userRoute,
    usersDocsRoute: usersDocsRoute,
    roleRoute: roleRoute,
    permissionsRoute: permissionsRoute,
    walletRoute: walletRoute,
    transactionsRoute: transactionsRoute,
    companyRoute: companyRoute,
    offerRoute: offerRoute,
};

export default router;