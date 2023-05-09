import Request from "@/models/value_objects/contracts/requests/request";

class DeleteOneByIdRequest extends Request {
    id: string

    constructor(id: string) {
        super();
        this.id = id;
    }
}

export default DeleteOneByIdRequest;