import { Request, Response, NextFunction } from "express";
import BaseService from "src/apis/base_service";
import make_response from "src/helpers/make_response";

function basic_tenant_manager({ permission, modelCorespondances, authaurizedTenant = [] }: { permission?: string; modelCorespondances?: string[]; authaurizedTenant?: string[] }) {
    const service = new BaseService();
    const client = service.get_prisma_client();

    async function have_perm({ tenant, permission }: { tenant: number; permission: string; }) {
        const perm = (await client.$queryRaw<{ [x: string]: any }[]>`SELECT id FROM permissions WHERE name = ${permission};`)[0];
        let havePermission = [];
        if (perm)
            havePermission = await client.$queryRaw<[]>`SELECT role_id FROM roleToPermission WHERE role_id = ${tenant} AND permission_id = ${perm.id};`
        return havePermission.length > 0 ? true : false;
    }

    return async (req: Request, res: Response, next: NextFunction) => {
        const tenant = res.locals.auth.tenant;
        // read_users
        if (tenant) {

            let role: any = undefined;
            let i = 0;

            while (!role && i < authaurizedTenant.length) {
                role = (await client.$queryRaw<{ [x: string]: any }[]>`SELECT id FROM role WHERE name = ${authaurizedTenant[i]};`)[0];
                i++;
            }

            if (role && role.id == tenant) {
                res.locals.auth["isAdmin"] = true;
            } else {
                const havePermission = await have_perm({ tenant: tenant, permission: String(permission) });

                if (!havePermission) {
                    res.status(401).send(make_response(true, "Unauthorized tenant!"));
                    return;
                }
            }

        } else {
            res.status(401).send(make_response(true, "Unauthorized tenant!"));
            if (process.env.DEBUG)
                console.warn("Tenant not specified !");

            return;
        }

        next();
    }
}


export default basic_tenant_manager;