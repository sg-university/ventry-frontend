import Transaction from "@/models/entities/transaction";
import TransactionItemMap from "@/models/entities/transaction_item_map";
import InventoryControl from "@/models/entities/inventory_control";

class CheckoutResponse extends Response {
    transaction: Transaction | undefined
    transactionItemMaps: TransactionItemMap[] | undefined
    inventoryControls: InventoryControl[] | undefined

    constructor(transaction: Transaction | undefined, transactionItemMaps: TransactionItemMap[] | undefined, inventoryControls: InventoryControl[] | undefined) {
        super();
        this.transaction = transaction;
        this.transactionItemMaps = transactionItemMaps;
        this.inventoryControls = inventoryControls;
    }

}

export default CheckoutResponse;