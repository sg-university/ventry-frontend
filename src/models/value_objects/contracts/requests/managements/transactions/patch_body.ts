import ValueObject from "@/models/value_objects/value_object";

class PatchBody extends ValueObject {
    accountId: string | undefined;
    sellPrice: number;
    timestamp: string | undefined;

    constructor(accountId: string | undefined, sellPrice: number, timestamp: string | undefined) {
        super();
        this.accountId = accountId;
        this.sellPrice = sellPrice;
        this.timestamp = timestamp;
    }
}

export default PatchBody;