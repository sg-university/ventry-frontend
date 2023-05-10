import BackendOneClient from "@/clients/backend_one_client";
import Client from "@/clients/client";
import Service from "@/services/service";
import {AxiosResponse} from "axios";
import Content from "@/models/value_objects/contracts/content";
import ItemBundleMap from "@/models/entities/item_bundle_map";
import CreateOneRequest
    from "@/models/value_objects/contracts/requests/managements/item_bundle_maps/create_one_request";
import DeleteOneByIdRequest
    from "@/models/value_objects/contracts/requests/managements/item_bundle_maps/delete_one_by_id_request";
import ReadOneByIdRequest
    from "@/models/value_objects/contracts/requests/managements/item_bundle_maps/read_one_by_id_request";
import PatchOneByIdRequest
    from "@/models/value_objects/contracts/requests/managements/item_bundle_maps/patch_one_by_id_request";
import ReadAllBySuperItemIdRequest
    from "@/models/value_objects/contracts/requests/managements/item_bundle_maps/read_all_by_super_item_id_request";

class ItemBundleMapService extends Service {

    client: Client;

    path: string;

    constructor() {
        super();
        this.path = '/item-bundle-maps';
        this.client = new BackendOneClient();
    }

    createOne(request: CreateOneRequest): Promise<AxiosResponse<Content<ItemBundleMap>>> {
        return this.client.instance.post(`${this.path}`, request.body);
    }

    deleteOneById(request: DeleteOneByIdRequest): Promise<AxiosResponse<Content<ItemBundleMap>>> {
        return this.client.instance.delete(`${this.path}/${request.id}`);
    }

    readAll(): Promise<AxiosResponse<Content<ItemBundleMap[]>>> {
        return this.client.instance.get(`${this.path}`);
    }

    readAllBySuperItemId(request: ReadAllBySuperItemIdRequest): Promise<AxiosResponse<Content<ItemBundleMap[]>>> {
        return this.client.instance.get(`${this.path}?super_item_id=${request.superItemId}`);
    }

    readOneById(request: ReadOneByIdRequest): Promise<AxiosResponse<Content<ItemBundleMap>>> {
        return this.client.instance.get(`${this.path}/${request.id}`);
    }

    patchOneById(request: PatchOneByIdRequest): Promise<AxiosResponse<Content<ItemBundleMap>>> {
        return this.client.instance.patch(`${this.path}/${request.id}`, request.body);
    }

}


export default ItemBundleMapService;