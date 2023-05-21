import Request from "@/models/value_objects/contracts/requests/request";
import CheckoutBody from "@/models/value_objects/contracts/requests/managements/transactions/checkout_body";

class CheckoutRequest extends Request {
    body: CheckoutBody | undefined

    constructor(body: CheckoutBody | undefined) {
        super();
        this.body = body;
    }
}

export default CheckoutRequest;