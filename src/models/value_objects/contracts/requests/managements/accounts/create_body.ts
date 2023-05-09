import ValueObject from "@/models/value_objects/value_object";

class CreateBody extends ValueObject {
    roleId: string
    locationId: string
    name: string
    email: string
    password: string

    constructor(roleId: string, locationId: string, name: string, email: string, password: string) {
        super();
        this.roleId = roleId;
        this.locationId = locationId
        this.name = name;
        this.email = email;
        this.password = password;
    }
}

export default CreateBody;