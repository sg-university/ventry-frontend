import ValueObject from "@/models/value_objects/value_object";

class CreateBody extends ValueObject {
    name: string;
    description: string;

    constructor(name: string, description: string) {
        super();
        this.name = name;
        this.description = description;
    }
}

export default CreateBody;