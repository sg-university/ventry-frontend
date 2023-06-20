import Entity from "@/models/entities/entity";

class InventoryControl extends Entity {
    id: string | undefined;
    accountId: string | undefined;
    itemId: string | undefined;
    quantityBefore: number | undefined;
    quantityAfter: number | undefined;
    timestamp: string | undefined;
    createdAt: Date | undefined;
    updatedAt: Date | undefined;

    constructor(id: string | undefined, accountId: string | undefined, itemId: string | undefined, quantityBefore: number | undefined, quantityAfter: number | undefined, timestamp: string | undefined, createdAt: Date | undefined, updatedAt: Date | undefined) {
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