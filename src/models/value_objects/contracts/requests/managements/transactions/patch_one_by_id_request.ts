import Request from "@/models/value_objects/contracts/requests/request";
import PatchBody from "@/models/value_objects/contracts/requests/managements/transactions/patch_body";

class PatchOneByIdRequest extends Request {
    id: string | undefined
    body: PatchBody

    constructor(id: string | undefined, body: PatchBody) {
        super();
        this.id = id;
        this.body = body;
    }
}

export default PatchOneByIdRequest;