import ValueObject from "@/models/value_objects/value_object";

class PredictionStockValueForecast extends ValueObject {
    timestamp: string | undefined
    quantityBefore: number | undefined
    quantityAfter: number | undefined

    constructor(timestamp: string | undefined, quantityBefore: number | undefined, quantityAfter: number | undefined) {
        super();
        this.timestamp = timestamp;
        this.quantityBefore = quantityBefore;
        this.quantityAfter = quantityAfter;
    }
}

export default PredictionStockValueForecast;