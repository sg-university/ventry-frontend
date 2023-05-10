import ValueObject from "@/models/value_objects/value_object";

class CreateBody extends ValueObject {
    locationId: string | undefined;
    code: string | undefined;
    name: string | undefined;
    type: string | undefined;
    description: string | undefined;
    quantity: number;
    unitName: string | undefined;
    unitSellPrice: number;
    unitCostPrice: number;
    
    constructor(locationId: string | undefined, code: string | undefined, name: string | undefined, type: string | undefined, description: string | undefined, quantity: number, unitName: string | undefined, unitSellPrice: number, unitCostPrice: number) {
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
  }
}

export default CreateBody;