import Request from "@/models/value_objects/contracts/requests/request";

class ReadAllBySuperItemIdRequest extends Request {
    superItemId: string | undefined

    constructor(id: string | undefined) {
        super();
        this.superItemId = id;
    }
}

export default ReadAllBySuperItemIdRequest;