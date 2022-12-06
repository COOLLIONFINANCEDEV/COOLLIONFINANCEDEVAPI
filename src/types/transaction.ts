type customTransaction = {
    amount: number,
    type: "investment" | "deposit" | "withdrawal",
    wallet_id: number,
    currency: string,
    service: string,
    transaction_id: string,
    method?: string,
    status?: "pending" | "success" | "refused",
}

export default customTransaction;