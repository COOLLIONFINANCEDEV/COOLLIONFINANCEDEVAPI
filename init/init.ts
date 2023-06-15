// npx nodemon --watch ./init -e js,ts,json --exec \"ts-node init/init.ts\"

import { generateAccountType } from "./generate-basic-account-type.init";
import { buildRoles } from "./generate-basic-role.init";
import { generatePermissions } from "./generate-permission.init";

(async () => {
    try {
        await generatePermissions();
        await buildRoles();
        await generateAccountType();
    } catch (error) {
        console.error('Error occurred:', error);
    }
})();
