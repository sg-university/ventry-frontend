import Entity from "@/models/entities/entity";

class Company extends Entity {
    id: string;
    name: string;
    description: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(id: string, name: string, description: string, address: string, createdAt: Date, updatedAt: Date) {
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