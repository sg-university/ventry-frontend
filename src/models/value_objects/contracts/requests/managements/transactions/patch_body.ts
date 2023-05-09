import ValueObject from "@/models/value_objects/value_object";

class PatchBody extends ValueObject {
    accountId: string;
    sellPrice: number;
    timestamp: string;

    constructor(accountId: string, sellPrice: number, timestamp: string) {
        super();
        this.accountId = accountId;
        this.sellPrice = sellPrice;
        this.timestamp = timestamp;
    }
}

export default PatchBody;