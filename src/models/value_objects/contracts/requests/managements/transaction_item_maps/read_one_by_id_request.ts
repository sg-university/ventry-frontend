import Request from "@/models/value_objects/contracts/requests/request";

class ReadOneByIdRequest extends Request {
    id: string | undefined

    constructor(id: string | undefined) {
        super();
        this.id = id;
    }
}

export default ReadOneByIdRequest;