const BaseService = require("./service.js");
const Serializer = require('../serializers/serializer.js');

class Loan extends BaseService {
    constructor(model, table) {
        super(model, table);

        this.interest_rate;
        this.capital_limit;
        this.payment_frequency;
        this.term;
        this.late_payment;
    }

    loadModel(loan) {
        return Serializer.normalize({
            interest_rate: loan.interest_rate,
            capital_limit: loan.capital_limit,
            payment_frequency: loan.payment_frequency,
            term: loan.term,
            late_payment: loan.late_payment,
        }, [])
    }
}


module.exports = Loan;