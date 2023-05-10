import BackendOneClient from "@/clients/backend_one_client";
import Client from "@/clients/client";
import Service from "@/services/service";
import {AxiosResponse} from "axios";
import Content from "@/models/value_objects/contracts/content";
import CreateOneRequest from "@/models/value_objects/contracts/requests/managements/accounts/create_one_request";
import Account from "@/models/entities/account";
import DeleteOneByIdRequest
    from "@/models/value_objects/contracts/requests/managements/accounts/delete_one_by_id_request";
import ReadOneByIdRequest from "@/models/value_objects/contracts/requests/managements/accounts/read_one_by_id_request";
import PatchOneByIdRequest
    from "@/models/value_objects/contracts/requests/managements/accounts/patch_one_by_id_request";
import ReadAllByCompanyIdRequest
    from "@/models/value_objects/contracts/requests/managements/accounts/read_all_by_company_id_request";

class AccountService extends Service {

    client: Client;

    path: string;

    constructor() {
        super();
        this.path = '/accounts';
        this.client = new BackendOneClient();
    }

    createOne(request: CreateOneRequest): Promise<AxiosResponse<Content<Account>>> {
        return this.client.instance.post(`${this.path}`, request.body);
    }

    deleteOneById(request: DeleteOneByIdRequest): Promise<AxiosResponse<Content<Account>>> {
        return this.client.instance.delete(`${this.path}/${request.id}`);
    }

    readAll(): Promise<AxiosResponse<Content<Account[]>>> {
        return this.client.instance.get(`${this.path}`);
    }

    readAllByCompanyId(request: ReadAllByCompanyIdRequest) {
        return this.client.instance.get(`${this.path}?company_id=${request.companyId}`);
    }

    readOneById(request: ReadOneByIdRequest): Promise<AxiosResponse<Content<Account>>> {
        return this.client.instance.get(`${this.path}/${request.id}`);
    }

    patchOneById(request: PatchOneByIdRequest): Promise<AxiosResponse<Content<Account>>> {
        return this.client.instance.patch(`${this.path}/${request.id}`, request.body);
    }

}


export default AccountService;