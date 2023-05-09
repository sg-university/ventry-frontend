import Entity from "@/models/entities/entity";

class TransactionItemMap extends Entity {
    id: string;
    transactionId: string;
    itemId: string;
    sellPrice: number;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(id: string, transactionId: string, itemId: string, sellPrice: number, quantity: number, createdAt: Date, updatedAt: Date) {
        super();
        this.id = id;
        this.transactionId = transactionId;
        this.itemId = itemId;
        this.sellPrice = sellPrice;
        this.quantity = quantity;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

export default TransactionItemMap;