import Entity from "@/models/entities/entity";

class InventoryControl extends Entity {
    id: string;
    accountId: string;
    itemId: string;
    quantityBefore: number;
    quantityAfter: number;
    timestamp: Date;
    createdAt: Date;
    updatedAt: Date;

    constructor(id: string, accountId: string, itemId: string, quantityBefore: number, quantityAfter: number, timestamp: Date, createdAt: Date, updatedAt: Date) {
        super();
        this.id = id;
        this.accountId = accountId;
        this.itemId = itemId;
        this.quantityBefore = quantityBefore;
        this.quantityAfter = quantityAfter;
        this.timestamp = timestamp;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

export default InventoryControl;