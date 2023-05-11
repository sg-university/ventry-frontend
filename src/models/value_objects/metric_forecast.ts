import ValueObject from "@/models/value_objects/value_object";

class MetricForecast extends ValueObject {
    smape: string | undefined
    mae: string | undefined

    constructor(smape: string | undefined, mae: string | undefined) {
        super();
        this.smape = smape;
        this.mae = mae;
    }
}

export default MetricForecast;