import {AxiosInstance} from "axios";
import ClientSetting from "@/settings/client_setting";


abstract class Client {
    abstract instance: AxiosInstance;

    abstract clientSetting: ClientSetting;


}

export default Client;