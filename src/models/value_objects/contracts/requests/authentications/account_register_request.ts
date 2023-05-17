import Request from "@/models/value_objects/contracts/requests/request";

class AccountRegisterRequest extends Request {
    name: string | undefined;
    email: string | undefined;
    password: string | undefined;

    constructor(name: string | undefined, email: string | undefined, password: string | undefined) {
        super();
        this.name = name;
        this.email = email;
        this.password = password;
    }
}

export default AccountRegisterRequest;