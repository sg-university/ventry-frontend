import BackendOneClient from "@/clients/backend_one_client";
import Client from "@/clients/client";
import Service from "@/services/service";
import {AxiosResponse} from "axios";
import Content from "@/models/value_objects/contracts/content";
import Location from "@/models/entities/location";
import CreateOneRequest from "@/models/value_objects/contracts/requests/managements/locations/create_one_request";
import DeleteOneByIdRequest
    from "@/models/value_objects/contracts/requests/managements/locations/delete_one_by_id_request";
import ReadOneByIdRequest from "@/models/value_objects/contracts/requests/managements/locations/read_one_by_id_request";
import PatchOneByIdRequest
    from "@/models/value_objects/contracts/requests/managements/locations/patch_one_by_id_request";
import ReadAllByAccountIdRequest
    from "@/models/value_objects/contracts/requests/managements/locations/read_all_by_account_id_request";
import ReadAllByItemIdRequest
    from "@/models/value_objects/contracts/requests/managements/locations/read_all_by_item_id_request";

class LocationService extends Service {

    client: Client;

    path: string;

    constructor() {
        super();
        this.path = '/locations';
        this.client = new BackendOneClient();
    }

    createOne(request: CreateOneRequest): Promise<AxiosResponse<Content<Location>>> {
        return this.client.instance.post(`${this.path}`, request.body);
    }

    deleteOneById(request: DeleteOneByIdRequest): Promise<AxiosResponse<Content<Location>>> {
        return this.client.instance.delete(`${this.path}/${request.id}`);
    }

    readAll(): Promise<AxiosResponse<Content<Location[]>>> {
        return this.client.instance.get(`${this.path}`);
    }

    readAllByItemId(request: ReadAllByItemIdRequest): Promise<AxiosResponse<Content<Location[]>>> {
        return this.client.instance.get(`${this.path}?item_id=${request.itemId}`);
    }

    readAllByAccountId(request: ReadAllByAccountIdRequest): Promise<AxiosResponse<Content<Location[]>>> {
        return this.client.instance.get(`${this.path}?account_id=${request.accountId}`);
    }

    readOneById(request: ReadOneByIdRequest): Promise<AxiosResponse<Content<Location>>> {
        return this.client.instance.get(`${this.path}/${request.id}`);
    }

    patchOneById(request: PatchOneByIdRequest): Promise<AxiosResponse<Content<Location>>> {
        return this.client.instance.patch(`${this.path}/${request.id}`, request.body);
    }

}


export default LocationService;