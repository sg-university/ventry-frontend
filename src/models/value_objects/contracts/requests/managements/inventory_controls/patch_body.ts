import ValueObject from "@/models/value_objects/value_object";

class PatchBody extends ValueObject {
    accountId: string;
    itemId: string;
    quantityBefore: number;
    quantityAfter: number;
    timestamp: Date;

    constructor(accountId: string, itemId: string, quantityBefore: number, quantityAfter: number, timestamp: Date) {
        super();
        this.accountId = accountId;
        this.itemId = itemId;
        this.quantityBefore = quantityBefore;
        this.quantityAfter = quantityAfter;
        this.timestamp = timestamp;
    }
}

export default PatchBody;