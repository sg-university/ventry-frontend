import BackendOneClient from "@/clients/backend_one_client";
import Client from "@/clients/client";
import Service from "@/services/service";
import {AxiosResponse} from "axios";
import Content from "@/models/value_objects/contracts/content";
import Role from "@/models/entities/role";
import StockForecastByItemIdRequest
    from "@/models/value_objects/contracts/requests/forecasts/item_stocks/stock_forecast_by_item_id_request";

class ForecastService extends Service {

    client: Client;

    path: string;

    constructor() {
        super();
        this.path = '/forecasts';
        this.client = new BackendOneClient();
    }

    forecastStockByItemId(request: StockForecastByItemIdRequest): Promise<AxiosResponse<Content<Role>>> {
        return this.client.instance.post(`${this.path}/items/${request.itemId}/stock`, request);
    }

    forecastTransactionByItemId(request: StockForecastByItemIdRequest): Promise<AxiosResponse<Content<Role>>> {
        return this.client.instance.post(`${this.path}/items/${request.itemId}/transaction`, request);
    }


}


export default ForecastService;