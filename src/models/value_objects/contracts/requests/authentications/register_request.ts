import Request from "@/models/value_objects/contracts/requests/request";

class RegisterRequest extends Request {

    name: string;
    email: string;
    password: string;

    constructor(name: string, email: string, password: string) {
        super();
        this.name = name;
        this.email = email;
        this.password = password;
    }
}

export default RegisterRequest;