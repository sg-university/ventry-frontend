import ValueObject from "@/models/value_objects/value_object";
import PredictionStockValueForecast from "@/models/value_objects/prediction_stock_value_forecast";

class PredictionStockForecast extends ValueObject {
    past: PredictionStockValueForecast[] | undefined
    future: PredictionStockValueForecast[] | undefined

    constructor(past: PredictionStockValueForecast[] | undefined, future: PredictionStockValueForecast[] | undefined) {
        super();
        this.past = past;
        this.future = future;
    }
}

export default PredictionStockForecast;