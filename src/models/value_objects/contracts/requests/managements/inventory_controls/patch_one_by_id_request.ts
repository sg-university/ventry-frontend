import Request from "@/models/value_objects/contracts/requests/request";
import PatchBody from "@/models/value_objects/contracts/requests/managements/inventory_controls/patch_body";

class PatchOneByIdRequest extends Request {
    id: string
    body: PatchBody

    constructor(id: string, body: PatchBody) {
        super();
        this.id = id;
        this.body = body;
    }
}

export default PatchOneByIdRequest;