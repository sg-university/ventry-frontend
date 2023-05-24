import MetricForecast from "@/models/value_objects/forecasts/metric_forecast";
import PredictionTransactionForecast from "@/models/value_objects/forecasts/prediction_transaction_forecast";
import Response from "@/models/value_objects/contracts/response/response";

class TransactionForecastResponse extends Response {
    prediction: PredictionTransactionForecast | undefined;
    metric: MetricForecast | undefined;

    constructor(prediction: PredictionTransactionForecast | undefined, metric: MetricForecast | undefined) {
        super();
        this.prediction = prediction;
        this.metric = metric;
    }
}

export default TransactionForecastResponse;