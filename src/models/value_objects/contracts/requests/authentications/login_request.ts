import Request from "@/models/value_objects/contracts/requests/request";

class LoginRequest extends Request {

    email: string;
    password: string;

    constructor(email: string, password: string) {
        super();
        this.email = email;
        this.password = password;
    }
}

export default LoginRequest;