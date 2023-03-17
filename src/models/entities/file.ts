import Entity from "@/models/entities/entity";

class File extends Entity {
    id: string;
    name: string;
    description: string;
    extension: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(id: string, name: string, description: string, extension: string, content: string, createdAt: Date, updatedAt: Date) {
        super();
        this.id = id;
        this.name = name;
        this.description = description;
        this.extension = extension;
        this.content = content;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

export default File;