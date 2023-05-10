import Request from "@/models/value_objects/contracts/requests/request";
import StockForecastBody from "@/models/value_objects/contracts/requests/forecasts/item_stocks/stock_forecast_body";

class StockForecastByItemIdRequest extends Request {
    itemId: string | undefined

    body: StockForecastBody

    constructor(itemId: string | undefined, body: StockForecastBody) {
        super();
        this.itemId = itemId;
        this.body = body;
    }
}

export default StockForecastByItemIdRequest;