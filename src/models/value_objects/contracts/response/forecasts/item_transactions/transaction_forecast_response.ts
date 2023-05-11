import MetricForecast from "@/models/value_objects/metric_forecast";
import PredictionTransactionForecast from "@/models/value_objects/prediction_transaction_forecast";

class TransactionForecastResponse extends Response {
    prediction: PredictionTransactionForecast;
    metric: MetricForecast;

    constructor(prediction: PredictionTransactionForecast, metric: MetricForecast) {
        super();
        this.prediction = prediction;
        this.metric = metric;
    }
}

export default TransactionForecastResponse;