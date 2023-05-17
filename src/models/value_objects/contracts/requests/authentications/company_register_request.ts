import Request from "@/models/value_objects/contracts/requests/request";

class CompanyRegisterRequest extends Request {
    name: string | undefined;
    description: string | undefined;
    address: string | undefined;

    constructor(name: string | undefined, description: string | undefined, address: string | undefined) {
        super();
        this.name = name;
        this.description = description;
        this.address = address;
    }
}

export default CompanyRegisterRequest;