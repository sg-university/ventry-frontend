import ValueObject from "@/models/value_objects/value_object";

class PredictionForecast extends ValueObject {
    past: number[]
    future: number[]

    constructor(past: number[], future: number[]) {
        super();
        this.past = past;
        this.future = future;
    }
}

export default PredictionForecast;