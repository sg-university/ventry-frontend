import Request from "@/models/value_objects/contracts/requests/request";
import TransactionForecastBody
    from "@/models/value_objects/contracts/requests/forecasts/item_transactions/transaction_forecast_body";

class TransactionForecastByItemIdRequest extends Request {
    itemId: string | undefined

    body: TransactionForecastBody | undefined

    constructor(itemId: string | undefined, body: TransactionForecastBody | undefined) {
        super();
        this.itemId = itemId;
        this.body = body;
    }
}

export default TransactionForecastByItemIdRequest;