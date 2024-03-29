import ValueObject from "@/models/value_objects/value_object";

class PatchBody extends ValueObject {
    accountId: string | undefined;
    itemId: string | undefined;
    quantityBefore: number;
    quantityAfter: number;
    timestamp: string | undefined;

    constructor(accountId: string | undefined, itemId: string | undefined, quantityBefore: number, quantityAfter: number, timestamp: string | undefined) {
        super();
        this.accountId = accountId;
        this.itemId = itemId;
        this.quantityBefore = quantityBefore;
        this.quantityAfter = quantityAfter;
        this.timestamp = timestamp;
    }
}

export default PatchBody;