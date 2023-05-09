import ValueObject from "@/models/value_objects/value_object";

class PatchBody extends ValueObject {
  companyId: string
  name: string
  description: string
  address: string

  constructor(companyId: string, name: string, description: string, address: string) {
      super();
      this.companyId = companyId;
      this.name = name;
      this.description = description;
      this.address = address
  }
}

export default PatchBody;