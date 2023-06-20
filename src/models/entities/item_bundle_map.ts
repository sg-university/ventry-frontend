import Entity from "@/models/entities/entity";

class ItemBundleMap extends Entity {
    id: string | undefined;
    superItemId: string | undefined;
    subItemId: string | undefined;
    quantity: number | undefined;
    createdAt: Date | undefined;
    updatedAt: Date | undefined;

    constructor(id: string | undefined, superItemId: string | undefined, subItemId: string | undefined, quantity: number | undefined, createdAt: Date | undefined, updatedAt: Date | undefined) {
        super();
        this.id = id;
        this.superItemId = superItemId;
        this.subItemId = subItemId;
        this.quantity = quantity;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

export default ItemBundleMap;