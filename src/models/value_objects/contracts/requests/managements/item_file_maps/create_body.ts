import ValueObject from "@/models/value_objects/value_object";

class CreateBody extends ValueObject {
    itemId: string | undefined;
    fileId: string | undefined;

    constructor(itemId: string | undefined, fileId: string | undefined) {
        super();
        this.itemId = itemId;
        this.fileId = fileId;
    }
}

export default CreateBody;