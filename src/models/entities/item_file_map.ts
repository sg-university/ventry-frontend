import Entity from "@/models/entities/entity";

class ItemFileMap extends Entity {
    id: string;
    itemId: string;
    fileId: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(id: string, itemId: string, fileId: string, createdAt: Date, updatedAt: Date) {
        super();
        this.id = id;
        this.itemId = itemId;
        this.fileId = fileId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

export default ItemFileMap;