import Transaction from "@/models/entities/transaction";
import TransactionItemMap from "@/models/entities/transaction_item_map";
import InventoryControl from "@/models/entities/inventory_control";
import Item from "@/models/entities/item";
import Response from "@/models/value_objects/contracts/response/response";

class CheckoutResponse extends Response {
    transaction: Transaction | undefined
    transactionItemMaps: TransactionItemMap[] | undefined
    items: Item[] | undefined
    inventoryControls: InventoryControl[] | undefined

    constructor(transaction: Transaction | undefined, transactionItemMaps: TransactionItemMap[] | undefined, items: Item[] | undefined, inventoryControls: InventoryControl[] | undefined) {
        super();
        this.transaction = transaction;
        this.transactionItemMaps = transactionItemMaps;
        this.items = items;
        this.inventoryControls = inventoryControls;
    }

}

export default CheckoutResponse;