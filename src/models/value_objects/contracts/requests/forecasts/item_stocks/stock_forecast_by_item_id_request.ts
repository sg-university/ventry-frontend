import Request from "@/models/value_objects/contracts/requests/request";

class StockForecastByItemIdRequest extends Request {
    itemId: string
    horizon: number
    resample: string

    constructor(itemId: string, horizon: number, resample: string) {
        super();
        this.itemId = itemId;
        this.horizon = horizon;
        this.resample = resample;
    }
}

export default StockForecastByItemIdRequest;