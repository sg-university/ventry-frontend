import Request from "@/models/value_objects/contracts/requests/request";

class ReadAllByCompanyIdRequest extends Request {
    companyId: string | undefined

    constructor(companyId: string | undefined) {
        super();
        this.companyId = companyId;
    }
}

export default ReadAllByCompanyIdRequest;