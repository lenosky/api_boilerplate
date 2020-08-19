import { buildRequest, IRequest } from './request';

class ServiceBase {
    protected request: IRequest;

    constructor(host: string, token?: string) {
        this.request = buildRequest(host, token);
    }
}

export {
    ServiceBase
}