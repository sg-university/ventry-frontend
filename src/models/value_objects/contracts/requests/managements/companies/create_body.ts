import ValueObject from "@/models/value_objects/value_object";

class CreateBody extends ValueObject {
    name: string
    description: string
    address: string

    constructor(name: string, description: string, address: string) {
        super();
        this.name = name;
        this.description = description;
        this.address = address
    }
}

export default CreateBody;