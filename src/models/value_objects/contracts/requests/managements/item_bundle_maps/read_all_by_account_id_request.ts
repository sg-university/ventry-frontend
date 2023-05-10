import Request from "@/models/value_objects/contracts/requests/request";

class ReadAllByAccountIdRequest extends Request {
    accountId: string | undefined

    constructor(id: string | undefined) {
        super();
        this.accountId = id;
    }
}

export default ReadAllByAccountIdRequest;