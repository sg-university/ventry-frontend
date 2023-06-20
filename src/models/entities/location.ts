import Entity from "@/models/entities/entity";

class Location extends Entity {
    id: string | undefined;
    companyId: string | undefined;
    name: string | undefined;
    description: string | undefined;
    address: string | undefined;
    createdAt: Date | undefined;
    updatedAt: Date | undefined;

    constructor(id: string | undefined, companyId: string | undefined, name: string | undefined, description: string | undefined, address: string | undefined, createdAt: Date | undefined, updatedAt: Date | undefined) {
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