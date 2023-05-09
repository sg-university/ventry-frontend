import Entity from "@/models/entities/entity";

class Account extends Entity {
    id: string;
    roleId: string;
    locationId: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(id: string, roleId: string, locationId: string, name: string, email: string, password: string, createdAt: Date, updatedAt: Date) {
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