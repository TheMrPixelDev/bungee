export type Method = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'OPTIONS';
export type EndpointRequest = Request & { query?: KeyValue };
export type HandlerFunction = (request: Request) => Response;
export type ParsedRequest = { rawRequest: Request; method: Method; path: string[] };
