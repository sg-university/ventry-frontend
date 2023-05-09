import BackendOneClient from "@/clients/backend_one_client";
import Client from "@/clients/client";
import Service from "@/services/service";
import {AxiosResponse} from "axios";
import Content from "@/models/value_objects/contracts/content";
import Company from "@/models/entities/company";
import CreateOneRequest from "@/models/value_objects/contracts/requests/managements/companies/create_one_request";
import DeleteOneByIdRequest from "@/models/value_objects/contracts/requests/managements/companies/delete_one_by_id_request";
import ReadOneByIdRequest from "@/models/value_objects/contracts/requests/managements/companies/read_one_by_id_request";
import PatchOneByIdRequest from "@/models/value_objects/contracts/requests/managements/companies/patch_one_by_id_request";

class CompanyService extends Service {

    client: Client;

    path: string;

    constructor() {
        super();
        this.path = '/companies';
        this.client = new BackendOneClient();
    }

    createOne(request: CreateOneRequest): Promise<AxiosResponse<Content<Company>>> {
        return this.client.instance.post(`${this.path}`, request.body);
    }

    deleteOneById(request: DeleteOneByIdRequest): Promise<AxiosResponse<Content<Company>>> {
        return this.client.instance.delete(`${this.path}/${request.id}`);
    }

    readAll(): Promise<AxiosResponse<Content<Company[]>>> {
        return this.client.instance.get(`${this.path}`);
    }

    readOneById(request: ReadOneByIdRequest): Promise<AxiosResponse<Content<Company>>> {
        return this.client.instance.get(`${this.path}/${request.id}`);
    }

    patchOneById(request: PatchOneByIdRequest): Promise<AxiosResponse<Content<Company>>> {
        return this.client.instance.patch(`${this.path}/${request.id}`, request.body);
    }
}


export default CompanyService;