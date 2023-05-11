import ValueObject from "@/models/value_objects/value_object";

class PredictionTransactionValueForecast extends ValueObject {
    timestamp: string | undefined

    quantity: number | undefined

    constructor(timestamp: string | undefined, quantity: number | undefined) {
        super();
        this.timestamp = timestamp;
        this.quantity = quantity;
    }
}

export default PredictionTransactionValueForecast;