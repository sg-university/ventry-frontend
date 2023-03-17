import Client from "@/clients/client";


abstract class Service {
    abstract client: Client;

    abstract path: string;

}

export default Service;
