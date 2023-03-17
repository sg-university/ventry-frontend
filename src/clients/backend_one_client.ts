import ClientSetting from "@/settings/client_setting";
import axios, {AxiosInstance} from "axios";
import applyCaseMiddleware from 'axios-case-converter';
import Client from "./client";

class BackendOneClient extends Client {
    instance: AxiosInstance;

    clientSetting: ClientSetting;


    constructor() {
        super();
        this.clientSetting = new ClientSetting();
        this.instance = axios.create({
            baseURL: this.clientSetting.backendOneClientApiV1Url,
        });
        this.instance = applyCaseMiddleware(this.instance);
    }

}

export default BackendOneClient;