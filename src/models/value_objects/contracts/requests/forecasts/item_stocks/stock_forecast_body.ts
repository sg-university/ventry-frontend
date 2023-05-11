import Request from "@/models/value_objects/contracts/requests/request";

class StockForecastBody extends Request {
    horizon: number
    resample: string | undefined
    testSize: number

    constructor(horizon: number, resample: string | undefined, testSize: number) {
        super();
        this.horizon = horizon;
        this.resample = resample;
        this.testSize = testSize;
    }
}

export default StockForecastBody;