import Request from "@/models/value_objects/contracts/requests/request";

class ReadAllByCompanyIdRequest extends Request {
    companyId: string | undefined

    constructor(id: string | undefined) {
        super();
        this.companyId = id;
    }
}

export default ReadAllByCompanyIdRequest;