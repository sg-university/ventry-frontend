import Request from "@/models/value_objects/contracts/requests/request";

class RegisterRequest extends Request {

    roleId: string;
    name: string;
    email: string;
    password: string;

    constructor(roleId: string, name: string, email: string, password: string) {
        super();
        this.roleId = roleId;
        this.name = name;
        this.email = email;
        this.password = password;
    }
}

export default RegisterRequest;