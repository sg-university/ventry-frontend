import Entity from "@/models/entities/entity";

class Role extends Entity {
    id: string | undefined;
    name: string | undefined;
    description: string | undefined;
    createdAt: Date | undefined;
    updatedAt: Date | undefined;

    constructor(id: string | undefined, name: string | undefined, description: string | undefined, createdAt: Date | undefined, updatedAt: Date | undefined) {
        super();
        this.id = id;
        this.name = name;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

export default Role;