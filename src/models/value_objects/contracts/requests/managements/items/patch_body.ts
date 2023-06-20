import ValueObject from "@/models/value_objects/value_object";

class PatchBody extends ValueObject {
    locationId: string | undefined;
    code: string | undefined;
    name: string | undefined;
    type: string | undefined;
    description: string | undefined;
    quantity: number | undefined;
    unitName: string | undefined;
    unitSellPrice: number | undefined;
    unitCostPrice: number | undefined;
    image: Blob | undefined;

    constructor(locationId: string | undefined, code: string | undefined, name: string | undefined, type: string | undefined, description: string | undefined, quantity: number | undefined, unitName: string | undefined, unitSellPrice: number | undefined, unitCostPrice: number | undefined, image: Blob | undefined) {
        super();
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
    }
}

export default PatchBody;