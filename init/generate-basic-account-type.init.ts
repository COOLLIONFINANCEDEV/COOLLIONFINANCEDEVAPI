import { TAccountTypesCodename } from "../src/types/app.type";

const accountTypes: {
    name: string,
    codename: TAccountTypesCodename,
    description?: string,
    restricted: boolean
}[] = [
        {
            name: "administrator",
            codename: "ADMIN",
            description: "",
            restricted: true
        },
        {
            name: "borrower",
            codename: "BORROWER",
            description: "",
            restricted: false
        },
        {
            name: "lender",
            codename: "LENDER",
            description: "",
            restricted: true
        },
        {
            name: "community of lenders",
            codename: "LENDER_COMMUNITY",
            description: "",
            restricted: true
        },
    ];

const generateAccountType = async () => {
    const accountTypes = [];

};
