import Request from "@/models/value_objects/contracts/requests/request";

class StockForecastBody extends Request {
    horizon: number
    resample: string
    test_size: number

    constructor(horizon: number, resample: string, test_size: number) {
        super();
        this.horizon = horizon;
        this.resample = resample;
        this.test_size = test_size;
    }
}

export default StockForecastBody;