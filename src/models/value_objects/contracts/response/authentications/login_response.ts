import Response from "@/models/value_objects/contracts/response/response";
import Account from "@/models/entities/account";


class LoginResponse extends Response {

    entity: Account;

    constructor(entity: Account) {
        super();
        this.entity = entity;
    }

}

export default LoginResponse;