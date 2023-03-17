import Request from "@/models/value_objects/contracts/requests/request";
import PatchBody from "@/models/value_objects/contracts/requests/managements/account_permission_maps/patch_body";

class PatchOneByIdRequest extends Request {
    id: string
    entity: PatchBody

    constructor(id: string, entity: PatchBody) {
        super();
        this.id = id;
        this.entity = entity;
    }
}

export default PatchOneByIdRequest;