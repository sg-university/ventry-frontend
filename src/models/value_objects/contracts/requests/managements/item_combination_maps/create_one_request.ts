import Request from "@/models/value_objects/contracts/requests/request";
import CreateBody from "@/models/value_objects/contracts/requests/managements/account_permission_maps/create_body";

class CreateOneRequest extends Request {
    entity: CreateBody

    constructor(entity: CreateBody) {
        super();
        this.entity = entity;
    }
}

export default CreateOneRequest;