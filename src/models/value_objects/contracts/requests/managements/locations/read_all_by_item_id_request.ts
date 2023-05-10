import Request from "@/models/value_objects/contracts/requests/request";

class ReadAllByItemIdRequest extends Request {
    itemId: string | undefined

    constructor(id: string | undefined) {
        super();
        this.itemId = id;
    }
}

export default ReadAllByItemIdRequest;