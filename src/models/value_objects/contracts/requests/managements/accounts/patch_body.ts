import ValueObject from "@/models/value_objects/value_object";

class PatchBody extends ValueObject {
    roleId: string | undefined
    locationId: string | undefined
    name: string | undefined
    email: string | undefined
    password: string | undefined

    constructor(roleId: string | undefined, locationId: string | undefined, name: string | undefined, email: string | undefined, password: string | undefined) {
        super();
        this.roleId = roleId;
        this.locationId = locationId;
        this.name = name;
        this.email = email;
        this.password = password;
    }
}

export default PatchBody;