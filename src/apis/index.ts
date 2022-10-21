import userRoute from 'apis/users';
import usersDocsRoute from 'apis/users_docs';
import roleRoute from 'apis/role';
import permissionsRoute from 'apis/permissions';
import walletRoute from 'apis/wallet';
import transactionsRoute from 'src/apis/transaction';

const router = {
    userRoute: userRoute,
    usersDocsRoute: usersDocsRoute,
    roleRoute: roleRoute,
    permissionsRoute: permissionsRoute,
    walletRoute: walletRoute,
    transactionsRoute: transactionsRoute,
}

export default router;