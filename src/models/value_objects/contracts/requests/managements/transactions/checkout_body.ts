import ValueObject from "@/models/value_objects/value_object";
import CheckoutTransactionBody
    from "@/models/value_objects/contracts/requests/managements/transactions/checkout_transaction_body";
import CheckoutTransactionItemMapBody
    from "@/models/value_objects/contracts/requests/managements/transactions/checkout_transaction_item_map_body";

class CheckoutBody extends ValueObject {
    transaction: CheckoutTransactionBody | undefined
    transactionItemMaps: CheckoutTransactionItemMapBody[] | undefined
    isRecordToInventoryControls: Boolean | undefined

    constructor(transaction: CheckoutTransactionBody | undefined, transactionItemMaps: CheckoutTransactionItemMapBody[] | undefined, isRecordToInventoryControls: Boolean | undefined) {
        super();
        this.transaction = transaction;
        this.transactionItemMaps = transactionItemMaps;
        this.isRecordToInventoryControls = isRecordToInventoryControls;
    }


}

export default CheckoutBody;