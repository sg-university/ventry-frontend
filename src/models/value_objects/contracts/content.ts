import ValueObject from "@/models/value_objects/value_object";

class Content<T> extends ValueObject {

    message: string | undefined;
    data: T;

    constructor(message: string | undefined, data: T) {
        super();
        this.message = message;
        this.data = data;
    }
}

export default Content;