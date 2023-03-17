import ValueObject from "@/models/value_objects/value_object";

class CreateBody extends ValueObject {
    accountId: string;
    sellPrice: number;
    timestamp: Date;

    constructor(accountId: string, sellPrice: number, timestamp: Date) {
        super();
        this.accountId = accountId;
        this.sellPrice = sellPrice;
        this.timestamp = timestamp;
    }
}

export default CreateBody;