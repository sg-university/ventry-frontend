import Entity from "@/models/entities/entity"


class TransactionItemMap extends Entity {
    id: string | undefined;
    transactionId: string | undefined;
    itemId: string | undefined;
    sellPrice: number | undefined;
    quantity: number | undefined;
    createdAt: Date | undefined;
    updatedAt: Date | undefined;

    constructor(id: string | undefined, transactionId: string | undefined, itemId: string | undefined, sellPrice: number | undefined, quantity: number | undefined, createdAt: Date | undefined, updatedAt: Date | undefined) {
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