type customTransaction = {
    amount: number,
    type: "investment" | "deposit" | "withdrawal",
    wallet_id: number,
    currency: string,
    service: string,
    transaction_id: string,
    method?: string,
    status?: "ACCEPTED" | "REJECTED" | "REFUSED",
}

export default customTransaction;