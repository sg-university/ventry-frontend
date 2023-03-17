import ValueObject from "@/models/value_objects/value_object";

class PatchBody extends ValueObject {
    itemId: string;
    fileId: string;

    constructor(itemId: string, fileId: string) {
        super();
        this.itemId = itemId;
        this.fileId = fileId;
    }
}

export default PatchBody;