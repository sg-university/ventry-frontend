import Entity from "@/models/entities/entity";

class AccountPermissionMap extends Entity {
    id: string;
    accountId: string;
    permissionId: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(id: string, accountId: string, permissionId: string, createdAt: Date, updatedAt: Date) {
        super();
        this.id = id;
        this.accountId = accountId;
        this.permissionId = permissionId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

export default AccountPermissionMap;