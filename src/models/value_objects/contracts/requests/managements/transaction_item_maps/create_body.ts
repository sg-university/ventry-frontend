import ValueObject from "@/models/value_objects/value_object";

class CreateBody extends ValueObject {
    transactionId: string;
    itemId: string;
    sellPrice: number;
    quantity: number;

    constructor(transactionId: string, itemId: string, sellPrice: number, quantity: number) {
        super();
        this.transactionId = transactionId;
        this.itemId = itemId;
        this.sellPrice = sellPrice;
        this.quantity = quantity;
    }
}

export default CreateBody;