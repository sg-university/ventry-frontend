import Entity from "@/models/entities/entity";

class Transaction extends Entity {
    id: string;
    accountId: string;
    sellPrice: number;
    timestamp: Date;
    createdAt: Date;
    updatedAt: Date;

    constructor(id: string, accountId: string, sellPrice: number, timestamp: Date, createdAt: Date, updatedAt: Date) {
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