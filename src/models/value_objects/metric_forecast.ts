import ValueObject from "@/models/value_objects/value_object";

class MetricForecast extends ValueObject {
    smape: string
    mape: string

    constructor(smape: string, mape: string) {
        super();
        this.smape = smape;
        this.mape = mape;
    }
}

export default MetricForecast;