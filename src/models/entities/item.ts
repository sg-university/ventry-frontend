import Entity from "@/models/entities/entity";

class Item extends Entity {
    id: string;
    locationId: string;
    code: string;
    name: string;
    type: string;
    description: string;
    quantity: number;
    unitName: string;
    unitSellPrice: number;
    unitCostPrice: number;
    image: Blob;
    createdAt: Date;
    updatedAt: Date;

    constructor(id: string, locationId: string, code: string, name: string, type: string, description: string, quantity: number, unitName: string, unitSellPrice: number, unitCostPrice: number, image: Blob, createdAt: Date, updatedAt: Date) {
        super();
        this.id = id;
        this.locationId = locationId;
        this.code = code;
        this.name = name;
        this.type = type;
        this.description = description;
        this.quantity = quantity;
        this.unitName = unitName;
        this.unitSellPrice = unitSellPrice;
        this.unitCostPrice = unitCostPrice;
        this.image = image;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

}

export default Item;