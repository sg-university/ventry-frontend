import Request from "@/models/value_objects/contracts/requests/request";

class ReadAllBySuperItemIdRequest extends Request {
    superItemId: string | undefined

    constructor(superItemId: string | undefined) {
        super();
        this.superItemId = superItemId;
    }
}

export default ReadAllBySuperItemIdRequest;