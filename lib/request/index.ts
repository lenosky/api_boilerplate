import * as fetchy from 'node-fetch';
import * as qs from 'querystring';
import * as URL from 'url';
import { logger } from '../report'
import { creds } from '../../framework/config';

interface IRequestParams {
    path: string,
    body?: any,
    headers?: object,
    queries?: object,
    token?: string;
}

interface IRequest {
    get(arg: IRequestParams): Promise<IResponse>;

    post(arg: IRequestParams): Promise<IResponse>;

    put(arg: IRequestParams): Promise<IResponse>;

    delete(arg: IRequestParams): Promise<IResponse>;
}

interface IResponse {
    body: any,
    status: number,
    headers?: object;
}

const methods = {
    post: 'POST',
    get: 'GET',
    put: 'PUT',
    delete: 'DELETE'
};

function createBody(body: any, method: string) {
    if (method === methods.get) {
        return;
    }

    if (typeof body === 'object') {
        return JSON.stringify(body);
    } else if (typeof body === 'string') {
        return body;
    }
}

async function _fetch(host: string, method: string, token: string, { path, body, headers, queries }): Promise<IResponse> {
    let queriesObj = {
        ...queries,
        access_token: token ? token : creds.token
    };

    queries = `?${qs.stringify(queriesObj)}`;

    body = createBody(body, method);
    headers = headers || {
        'Content-Type': 'application/json',
    };

    const requestUrl = `${URL.resolve(host, path)}${queries}`;
    logger(`\t[${method}] Request to: ${requestUrl}`, body || '', headers, queries);

    const response = await fetchy(requestUrl, { method, headers, body });

    const responseHeaders = Array
        .from(response.headers.entries())
        .reduce((acc, [key, value]) => {
            acc[key] = value.toLowerCase();

            return acc;
        }, {});

    const responseBodyMethod = responseHeaders['content-type'].includes('application/json') ? 'json' : 'text';

    const responseData = {
        body: await response[responseBodyMethod](),
        status: response.status,
        headers: responseHeaders as object
    };

    logger(`\t[${method}] Response data from: ${requestUrl}:`, responseData.body, responseData.status);

    return responseData;
}

function buildRequest(host: string, token: string): IRequest {
    return {
        get: _fetch.bind(_fetch, host, methods.get, token),
        post: _fetch.bind(_fetch, host, methods.post, token),
        put: _fetch.bind(_fetch, host, methods.put, token),
        delete: _fetch.bind(_fetch, host, methods.delete, token),
    }
}

export {
    buildRequest,
    IRequest
};