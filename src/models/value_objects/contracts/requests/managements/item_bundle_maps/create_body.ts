import ValueObject from "@/models/value_objects/value_object";

class CreateBody extends ValueObject {
    superItemId: string;
    subItemId: string;
    quantity: number;

    constructor(superItemId: string, subItemId: string, quantity: number) {
        super();
        this.superItemId = superItemId;
        this.subItemId = subItemId;
        this.quantity = quantity;
    }
}

export default CreateBody;