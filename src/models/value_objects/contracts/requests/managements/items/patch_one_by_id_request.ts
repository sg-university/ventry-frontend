import Request from "@/models/value_objects/contracts/requests/request";
import PatchBody from "@/models/value_objects/contracts/requests/managements/items/patch_body";

class PatchOneByIdRequest extends Request {
    id: string | undefined
    body: PatchBody | undefined

    constructor(id: string | undefined, body: PatchBody | undefined) {
        super();
        this.id = id;
        this.body = body;
    }
}

export default PatchOneByIdRequest;