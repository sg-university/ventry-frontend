import ValueObject from "@/models/value_objects/value_object";

class PatchBody extends ValueObject {
    name: string;
    description: string;
    extension: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(name: string, description: string, extension: string, content: string, createdAt: Date, updatedAt: Date) {
        super();
        this.name = name;
        this.description = description;
        this.extension = extension;
        this.content = content;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

export default PatchBody;