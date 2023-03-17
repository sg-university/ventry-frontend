import Entity from "@/models/entities/entity";

class Role extends Entity {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(id: string, name: string, description: string, createdAt: Date, updatedAt: Date) {
        super();
        this.id = id;
        this.name = name;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

export default Role;