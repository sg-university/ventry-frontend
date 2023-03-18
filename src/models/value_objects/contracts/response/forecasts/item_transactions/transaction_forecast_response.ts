import MetricForecast from "@/models/value_objects/metric_forecast";
import PredictionForecast from "@/models/value_objects/prediction_forecast";

class TransactionForecastResponse extends Response {
    predictionForecast: PredictionForecast;
    metricForecast: MetricForecast;

    constructor(predictionForecast: PredictionForecast, metricForecast: MetricForecast) {
        super();
        this.predictionForecast = predictionForecast;
        this.metricForecast = metricForecast;
    }
}

export default TransactionForecastResponse;