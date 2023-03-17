import Entity from "@/models/entities/entity";

class Item extends Entity {
    id: string;
    permissionId: string;
    code: string;
    name: string;
    description: string;
    combinationMaxQuantity: number;
    combinationMinQuantity: number;
    quantity: number;
    unitName: string;
    unitSellPrice: number;
    unitCostPrice: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(id: string, permissionId: string, code: string, name: string, description: string, combinationMaxQuantity: number, combinationMinQuantity: number, quantity: number, unitName: string, unitSellPrice: number, unitCostPrice: number, createdAt: Date, updatedAt: Date) {
        super();
        this.id = id;
        this.permissionId = permissionId;
        this.code = code;
        this.name = name;
        this.description = description;
        this.combinationMaxQuantity = combinationMaxQuantity;
        this.combinationMinQuantity = combinationMinQuantity;
        this.quantity = quantity;
        this.unitName = unitName;
        this.unitSellPrice = unitSellPrice;
        this.unitCostPrice = unitCostPrice;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

}

export default Item;