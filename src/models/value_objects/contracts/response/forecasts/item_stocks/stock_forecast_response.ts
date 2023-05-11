import MetricForecast from "@/models/value_objects/metric_forecast";
import PredictionTransactionForecast from "@/models/value_objects/prediction_transaction_forecast";
import PredictionStockForecast from "@/models/value_objects/prediction_stock_forecast";

class StockForecastResponse extends Response {
    prediction: PredictionStockForecast;
    metric: MetricForecast;

    constructor(prediction: PredictionStockForecast, metric: MetricForecast) {
        super();
        this.prediction = prediction;
        this.metric = metric;
    }
}

export default StockForecastResponse;