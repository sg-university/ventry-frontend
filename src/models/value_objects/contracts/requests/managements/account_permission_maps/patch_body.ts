import ValueObject from "@/models/value_objects/value_object";

class PatchBody extends ValueObject {
    accountId: string;
    permissionId: string;

    constructor(accountId: string, permissionId: string) {
        super();
        this.accountId = accountId;
        this.permissionId = permissionId;
    }
}

export default PatchBody;