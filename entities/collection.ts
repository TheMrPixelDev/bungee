import { Method, HandlerFunction, ParsedRequest } from '../types';

export class Collection {
    private name: string;
    private handlers: Record<Method, HandlerFunction> = [];
    private subCollections: Collection[] = [];

    constructor(name: string) {
        this.name = name;
    }

    private addHandler(method: Method, handler: HandlerFunction) {
        if (this.handlers[method] !== undefined && this.handlers[method] !== null) {
            this.handlers[method] = handler;
        } else {
            throw new Error(`[Bungee] There is already a handler for ${method} in Collection ${this.name}`);
        }
    }

    public addGet(handler: HandlerFunction) {
        this.addHandler('GET', handler);
    }

    public addPost(handler: HandlerFunction) {
        this.addHandler('POST', handler);
    }

    public addPatch(handler: HandlerFunction) {
        this.addHandler('PATCH', handler);
    }

    public attach(collection: Collection) {
        this.subCollections.push(collection);
    }

    private handleRequest(request: ParsedRequest) {
        const handler = this.handlers[request.method];
        handler(request.rawRequest);
    }

    private checkRequest(request: ParsedRequest) {
        if (request.path.length === 0) {
            this.handleRequest(request);
        }
    }
}
