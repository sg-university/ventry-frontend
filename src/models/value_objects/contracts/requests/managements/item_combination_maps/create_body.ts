import ValueObject from "@/models/value_objects/value_object";

class CreateBody extends ValueObject {
    superItemId: string;
    subItemId: string;

    constructor(superItemId: string, subItemId: string) {
        super();
        this.superItemId = superItemId;
        this.subItemId = subItemId;
    }
}

export default CreateBody;