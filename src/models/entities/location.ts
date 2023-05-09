import Entity from "@/models/entities/entity";

class Location extends Entity {
    id: string;
    companyId: string;
    name: string;
    description: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(id: string, companyId: string, name: string, description: string, address: string, createdAt: Date, updatedAt: Date) {
        super();
        this.id = id;
        this.companyId = companyId;
        this.name = name;
        this.description = description;
        this.address = address;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

}

export default Location;