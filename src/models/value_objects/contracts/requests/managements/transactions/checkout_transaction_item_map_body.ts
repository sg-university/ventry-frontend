import ValueObject from "@/models/value_objects/value_object";

class CheckoutTransactionItemMapBody extends ValueObject {
    itemId: string
    sellPrice: number
    quantity: number

    constructor(itemId: string, sellPrice: number, quantity: number) {
        super();
        this.itemId = itemId;
        this.sellPrice = sellPrice;
        this.quantity = quantity;
    }

}

export default CheckoutTransactionItemMapBody;