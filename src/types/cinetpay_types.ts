export type getPaymentUrlData = {
    apikey: string,
    site_id: number,
    transaction_id: string // uuid
    amount: number,
    currency: "XOF" | "XAF" | "CDF" | "GNF" | "USD",
    alternative_currency?: "XOF" | "XAF" | "CDF" | "GNF" | "USD",
    description: string,
    notify_url: string,
    return_url: string,
    channels: "ALL" | "MOBILE_MONEY" | "CREDIT_CARD" | "WALLET",
    lock_phone_number?: boolean,
    metadata?: string,
    lang?: string,
    invoice_data?: {},
    //Fournir ces variables pour le paiements par carte bancaire
    customer_id?: number, // card - L’identifiant du client dans votre système
    customer_name?: string, // card - Le nom du client
    customer_surname?: string, //card - Le prenom du client
    customer_email?: string, //card -l'email du client
    customer_phone_number?: string, // card - le numero du client
    customer_address?: string, // card - addresse du client
    customer_city?: string, // card - La ville du client
    customer_country?: string, // card - le code ISO du pays
    customer_state?: string, //card - le code ISO de l'état ou ou du pays
    customer_zip_code?: number, // card - code postal
}


export type addContactData = {
    prefix: number,
    phone: string,
    name: string,
    surname: string,
    email: string
}

export type transferMoneyDate = {
    prefix: number,
    phone: string,
    amount: number,
    client_transaction_id: string,
    notify_url: string,
}
