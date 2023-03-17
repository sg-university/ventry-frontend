import ValueObject from "@/models/value_objects/value_object";

class PatchBody extends ValueObject {
    roleId: string
    name: string
    email: string
    password: string

    constructor(roleId: string, name: string, email: string, password: string) {
        super();
        this.roleId = roleId;
        this.name = name;
        this.email = email;
        this.password = password;
    }
}

export default PatchBody;