import Entity from "@/models/entities/entity";

class Account extends Entity {
    id: string | undefined;
    roleId: string | undefined;
    locationId: string | undefined;
    name: string | undefined;
    email: string | undefined;
    password: string | undefined;
    createdAt: Date | undefined;
    updatedAt: Date | undefined;

    constructor(id: string | undefined, roleId: string | undefined, locationId: string | undefined, name: string | undefined, email: string | undefined, password: string | undefined, createdAt: Date | undefined, updatedAt: Date | undefined) {
        super();
        this.id = id;
        this.roleId = roleId;
        this.locationId = locationId;
        this.name = name;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

export default Account;