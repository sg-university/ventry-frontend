import Entity from "@/models/entities/entity";

class ItemCombinationMap extends Entity {
    id: string;
    superItemId: string;
    subItemId: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(id: string, superItemId: string, subItemId: string, createdAt: Date, updatedAt: Date) {
        super();
        this.id = id;
        this.superItemId = superItemId;
        this.subItemId = subItemId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

export default ItemCombinationMap;