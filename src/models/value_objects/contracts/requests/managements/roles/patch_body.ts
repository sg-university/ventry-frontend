import ValueObject from "@/models/value_objects/value_object";

class PatchBody extends ValueObject {

    name: string | undefined;
    description: string | undefined;

    constructor(name: string | undefined, description: string | undefined) {
        super();
        this.name = name;
        this.description = description;
    }
}

export default PatchBody;