// npx nodemon --watch ./init -e js,ts,json --exec \"ts-node init/init.ts\"

import { buildRoles } from "./generate-basic-role.init";
import { generatePermissions } from "./generate-permission.init";

(async () => {
    await generatePermissions();
})();

(async () => {
    await buildRoles();
})();