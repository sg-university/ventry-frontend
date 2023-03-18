import BackendOneClient from "@/clients/backend_one_client";
import Client from "@/clients/client";
import Service from "@/services/service";
import {AxiosResponse} from "axios";
import Content from "@/models/value_objects/contracts/content";
import StockForecastByItemIdRequest
    from "@/models/value_objects/contracts/requests/forecasts/item_stocks/stock_forecast_by_item_id_request";
import StockForecastResponse
    from "@/models/value_objects/contracts/response/forecasts/item_stocks/stock_forecast_response";
import TransactionForecastResponse
    from "@/models/value_objects/contracts/response/forecasts/item_transactions/transaction_forecast_response";

class ForecastService extends Service {

    client: Client;

    path: string;

    constructor() {
        super();
        this.path = '/forecasts';
        this.client = new BackendOneClient();
    }

    forecastStockByItemId(request: StockForecastByItemIdRequest): Promise<AxiosResponse<Content<StockForecastResponse>>> {
        return this.client.instance.post(`${this.path}/items/${request.itemId}/stock`, request.body);
    }

    forecastTransactionByItemId(request: StockForecastByItemIdRequest): Promise<AxiosResponse<Content<TransactionForecastResponse>>> {
        return this.client.instance.post(`${this.path}/items/${request.itemId}/transaction`, request.body);
    }


}


export default ForecastService;