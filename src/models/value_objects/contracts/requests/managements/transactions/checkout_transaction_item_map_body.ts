import ValueObject from "@/models/value_objects/value_object";

class CheckoutTransactionItemMapBody extends ValueObject {
    itemId: string | undefined
    sellPrice: number | undefined
    quantity: number | undefined

    constructor(itemId: string | undefined, sellPrice: number | undefined, quantity: number | undefined) {
        super();
        this.itemId = itemId;
        this.sellPrice = sellPrice;
        this.quantity = quantity;
    }


}

export default CheckoutTransactionItemMapBody;