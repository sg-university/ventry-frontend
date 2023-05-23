import MetricForecast from "@/models/value_objects/forecasts/metric_forecast";
import PredictionStockForecast from "@/models/value_objects/forecasts/prediction_stock_forecast";
import Response from "@/models/value_objects/contracts/response/response";

class StockForecastResponse extends Response {
    prediction: PredictionStockForecast | undefined;
    metric: MetricForecast | undefined;

    constructor(prediction: PredictionStockForecast | undefined, metric: MetricForecast | undefined) {
        super();
        this.prediction = prediction;
        this.metric = metric;
    }
}

export default StockForecastResponse;