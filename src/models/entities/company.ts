import Entity from "@/models/entities/entity";

class Company extends Entity {
    id: string | undefined;
    name: string | undefined;
    description: string | undefined;
    address: string | undefined;
    createdAt: Date | undefined;
    updatedAt: Date | undefined;

    constructor(id: string | undefined, name: string | undefined, description: string | undefined, address: string | undefined, createdAt: Date | undefined, updatedAt: Date | undefined) {
        super();
        this.id = id;
        this.name = name;
        this.description = description;
        this.address = address;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

}

export default Company;