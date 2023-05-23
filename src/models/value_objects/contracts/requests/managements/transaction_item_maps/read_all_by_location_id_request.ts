import Request from "@/models/value_objects/contracts/requests/request";

class ReadAllByLocationIdRequest extends Request {
    locationId: string | undefined

    constructor(locationId: string | undefined) {
        super();
        this.locationId = locationId;
    }
}

export default ReadAllByLocationIdRequest;