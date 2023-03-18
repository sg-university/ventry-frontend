import {AxiosResponse} from "axios";
import Service from "@/services/service";
import Client from "@/clients/client";
import BackendOneClient from "@/clients/backend_one_client";
import RegisterRequest from "@/models/value_objects/contracts/requests/authentications/register_request";
import LoginRequest from "@/models/value_objects/contracts/requests/authentications/login_request";
import RegisterResponse from "@/models/value_objects/contracts/response/authentications/register_response";
import LoginResponse from "@/models/value_objects/contracts/response/authentications/login_response";
import Content from "@/models/value_objects/contracts/content";


class AuthenticationService extends Service {

    client: Client;
    path: string;

    constructor() {
        super();
        this.path = '/authentications';
        this.client = new BackendOneClient();
    }

    register(request: RegisterRequest): Promise<AxiosResponse<Content<RegisterResponse>>> {
        return this.client.instance.post(`${this.path}/registers/email-and-password`, request);
    }

    login(request: LoginRequest): Promise<AxiosResponse<Content<LoginResponse>>> {
        return this.client.instance.post(`${this.path}/logins/email-and-password`, request);
    }

}

export default AuthenticationService;