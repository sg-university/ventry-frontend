import ValueObject from "@/models/value_objects/value_object";

class CheckoutTransactionBody extends ValueObject {
    accountId: string | undefined;
    sellPrice: number | undefined;
    timestamp: string | undefined;

    constructor(accountId: string | undefined, sellPrice: number | undefined, timestamp: string | undefined) {
        super();
        this.accountId = accountId;
        this.sellPrice = sellPrice;
        this.timestamp = timestamp;
    }
}

export default CheckoutTransactionBody;