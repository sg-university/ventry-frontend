class ClientSetting {
    backendOneClientApiV1Url: string

    constructor() {
        this.backendOneClientApiV1Url = process.env.NEXT_PUBLIC_API_URL_BACKEND_ONE || ""
    }

}


export default ClientSetting;