import Entity from "@/models/entities/entity";

class Transaction extends Entity {
    id: string | undefined;
    accountId: string | undefined;
    sellPrice: number | undefined;
    timestamp: string | undefined;
    createdAt: Date | undefined;
    updatedAt: Date | undefined;

    constructor(id: string | undefined, accountId: string | undefined, sellPrice: number | undefined, timestamp: string | undefined, createdAt: Date | undefined, updatedAt: Date | undefined) {
        super();
        this.id = id;
        this.accountId = accountId;
        this.sellPrice = sellPrice;
        this.timestamp = timestamp;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

export default Transaction;