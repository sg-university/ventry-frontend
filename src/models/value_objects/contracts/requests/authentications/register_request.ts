import Request from "@/models/value_objects/contracts/requests/request";
import AccountRegisterRequest from "@/models/value_objects/contracts/requests/authentications/account_register_request";
import CompanyRegisterRequest from "@/models/value_objects/contracts/requests/authentications/company_register_request";
import LocationRegisterRequest
    from "@/models/value_objects/contracts/requests/authentications/location_register_request";

class RegisterRequest extends Request {
    account: AccountRegisterRequest | undefined;
    company: CompanyRegisterRequest | undefined;
    location: LocationRegisterRequest | undefined;

    constructor(account: AccountRegisterRequest | undefined, company: CompanyRegisterRequest | undefined, location: LocationRegisterRequest | undefined) {
        super();
        this.account = account;
        this.company = company;
        this.location = location;
    }
}

export default RegisterRequest;