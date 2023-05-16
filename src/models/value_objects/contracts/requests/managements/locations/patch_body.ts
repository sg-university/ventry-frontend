import ValueObject from "@/models/value_objects/value_object";

class PatchBody extends ValueObject {
    companyId: string | undefined
    name: string | undefined
    description: string | undefined
    address: string | undefined

    constructor(companyId: string | undefined, name: string | undefined, description: string | undefined, address: string | undefined) {
        super();
        this.companyId = companyId;
        this.name = name;
        this.description = description;
        this.address = address
    }
}

export default PatchBody;