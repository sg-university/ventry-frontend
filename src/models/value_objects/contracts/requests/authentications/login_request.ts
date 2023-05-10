import Request from "@/models/value_objects/contracts/requests/request";

class LoginRequest extends Request {

    email: string | undefined;
    password: string | undefined;

    constructor(email: string | undefined, password: string | undefined) {
        super();
        this.email = email;
        this.password = password;
    }
}

export default LoginRequest;