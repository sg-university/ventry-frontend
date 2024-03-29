import BackendOneClient from "@/clients/backend_one_client";
import Client from "@/clients/client";
import Service from "@/services/service";
import {AxiosResponse} from "axios";
import Content from "@/models/value_objects/contracts/content";
import Transaction from "@/models/entities/transaction";
import CreateOneRequest from "@/models/value_objects/contracts/requests/managements/transactions/create_one_request";
import DeleteOneByIdRequest
    from "@/models/value_objects/contracts/requests/managements/transactions/delete_one_by_id_request";
import ReadOneByIdRequest
    from "@/models/value_objects/contracts/requests/managements/transactions/read_one_by_id_request";
import PatchOneByIdRequest
    from "@/models/value_objects/contracts/requests/managements/transactions/patch_one_by_id_request";
import ReadAllByLocationIdRequest
    from "@/models/value_objects/contracts/requests/managements/transactions/read_all_by_location_id_request";
import CheckoutRequest from "@/models/value_objects/contracts/requests/managements/transactions/checkout_request";
import CheckoutResponse from "@/models/value_objects/contracts/response/managements/transactions/checkout_response";

class TransactionService extends Service {

    client: Client;

    path: string;

    constructor() {
        super();
        this.path = '/transactions';
        this.client = new BackendOneClient();
    }

    createOne(request: CreateOneRequest): Promise<AxiosResponse<Content<Transaction>>> {
        return this.client.instance.post(`${this.path}`, request.body);
    }

    deleteOneById(request: DeleteOneByIdRequest): Promise<AxiosResponse<Content<Transaction>>> {
        return this.client.instance.delete(`${this.path}/${request.id}`);
    }

    readAll(): Promise<AxiosResponse<Content<Transaction[]>>> {
        return this.client.instance.get(`${this.path}`);
    }

    readAllByLocationId(request: ReadAllByLocationIdRequest): Promise<AxiosResponse<Content<Transaction[]>>> {
        return this.client.instance.get(`${this.path}?location_id=${request.locationId}`);
    }

    readOneById(request: ReadOneByIdRequest): Promise<AxiosResponse<Content<Transaction>>> {
        return this.client.instance.get(`${this.path}/${request.id}`)
    }

    patchOneById(request: PatchOneByIdRequest): Promise<AxiosResponse<Content<Transaction>>> {
        return this.client.instance.patch(`${this.path}/${request.id}`, request.body);
    }


    checkout(request: CheckoutRequest): Promise<AxiosResponse<Content<CheckoutResponse>>> {
        return this.client.instance.post(`${this.path}/checkout`, request.body);
    }

}


export default TransactionService;