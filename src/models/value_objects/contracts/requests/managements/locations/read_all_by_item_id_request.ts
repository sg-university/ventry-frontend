import Request from "@/models/value_objects/contracts/requests/request";

class ReadAllByItemIdRequest extends Request {
    itemId: string | undefined

    constructor(itemId: string | undefined) {
        super();
        this.itemId = itemId;
    }
}

export default ReadAllByItemIdRequest;