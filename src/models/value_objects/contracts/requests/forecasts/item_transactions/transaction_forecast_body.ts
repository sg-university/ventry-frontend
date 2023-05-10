import Request from "@/models/value_objects/contracts/requests/request";

class TransactionForecastBody extends Request {
    horizon: number
    resample: string | undefined
    test_size: number

    constructor(horizon: number, resample: string | undefined, test_size: number) {
        super();
        this.horizon = horizon;
        this.resample = resample;
        this.test_size = test_size;
    }
}

export default TransactionForecastBody;