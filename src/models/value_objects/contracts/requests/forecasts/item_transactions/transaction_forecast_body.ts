import Request from "@/models/value_objects/contracts/requests/request";

class TransactionForecastBody extends Request {
    horizon: number | undefined
    resample: string | undefined
    testSize: number | undefined

    constructor(horizon: number | undefined, resample: string | undefined, testSize: number | undefined) {
        super();
        this.horizon = horizon;
        this.resample = resample;
        this.testSize = testSize;
    }
}

export default TransactionForecastBody;