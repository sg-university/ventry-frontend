import Request from "@/models/value_objects/contracts/requests/request";

class ReadAllByLocationIdRequest extends Request {
    locationId: string | undefined

    constructor(id: string | undefined) {
        super();
        this.locationId = id;
    }
}

export default ReadAllByLocationIdRequest;