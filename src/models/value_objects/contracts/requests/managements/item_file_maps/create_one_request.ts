import Request from "@/models/value_objects/contracts/requests/request";
import CreateBody from "@/models/value_objects/contracts/requests/managements/item_file_maps/create_body";

class CreateOneRequest extends Request {
    body: CreateBody

    constructor(body: CreateBody) {
        super();
        this.body = body;
    }
}

export default CreateOneRequest;