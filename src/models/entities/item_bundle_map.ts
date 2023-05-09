import Entity from "@/models/entities/entity";

class ItemBundleMap extends Entity {
    id: string;
    superItemId: string;
    subItemId: string;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(id: string, superItemId: string, subItemId: string, quantity: number, createdAt: Date, updatedAt: Date) {
        super();
        this.id = id;
        this.superItemId = superItemId;
        this.subItemId = subItemId;
        this.quantity = quantity
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

export default ItemBundleMap;