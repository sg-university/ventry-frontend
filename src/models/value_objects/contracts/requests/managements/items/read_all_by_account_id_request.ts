import Request from "@/models/value_objects/contracts/requests/request";

class ReadAllByAccountIdRequest extends Request {
    accountId: string | undefined

    constructor(accountId: string | undefined) {
        super();
        this.accountId = accountId;
    }
}

export default ReadAllByAccountIdRequest;