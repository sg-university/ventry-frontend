import ValueObject from "@/models/value_objects/value_object";

class Content<T> extends ValueObject {

    message: string;
    data: T;

    constructor(message: string, data: T) {
        super();
        this.message = message;
        this.data = data;
    }
}

export default Content;