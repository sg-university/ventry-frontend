import ValueObject from "@/models/value_objects/value_object";
import PredictionTransactionValueForecast from "@/models/value_objects/forecasts/prediction_transaction_value_forecast";

class PredictionTransactionForecast extends ValueObject {
    past: PredictionTransactionValueForecast[] | undefined
    future: PredictionTransactionValueForecast[] | undefined

    constructor(past: PredictionTransactionValueForecast[] | undefined, future: PredictionTransactionValueForecast[] | undefined) {
        super();
        this.past = past;
        this.future = future;
    }
}

export default PredictionTransactionForecast;