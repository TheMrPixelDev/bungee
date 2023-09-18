import { Server } from "bun";
import { KeyValue, parseUrl, URL } from "./utlis";

export type Method = "GET" | "POST" | "PATCH" | "PUT" | "OPTIONS";
export type EndpointHandler = (req: EndpointRequest) => Response;
export type EndpointRequest = Request & { query?: KeyValue };

export class Bungee {
  private endpointGroups: Map<Method, Map<string, EndpointHandler>> = new Map();

  public get(path: string, handler: EndpointHandler): void {
    this.addEndpointToMethod(handler, "GET", path);
  }

  public post(path: string, handler: EndpointHandler): void {
    this.addEndpointToMethod(handler, "POST", path);
  }

  public put(path: string, handler: EndpointHandler): void {
    this.addEndpointToMethod(handler, "PUT", path);
  }

  public options(path: string, handler: EndpointHandler): void {
    this.addEndpointToMethod(handler, "OPTIONS", path);
  }

  public patch(path: string, handler: EndpointHandler): void {
    this.addEndpointToMethod(handler, "PATCH", path);
  }

  private handleRequest(
    req: Request,
    url: URL,
    method: Method,
  ): Response {
    const endpointGroup = this.endpointGroups.get(method);
    const { path, query } = url;

    if (path === undefined) {
      return new Response("Resource not found", { status: 404 });
    }

    if (endpointGroup === undefined) {
      return new Response("Method not allowed", {
        status: 405,
      });
    }

    const handler = endpointGroup.get(path);

    if (handler === undefined) {
      return new Response("Not found", { status: 404 });
    }

    return handler(Object.assign({ query }, req));
  }

  private addEndpointToMethod(
    func: EndpointHandler,
    method: Method,
    path: string,
  ): void {
    const endpointGroup = this.endpointGroups.get(method);

    if (endpointGroup === undefined) {
      const methodSpecificMap = new Map<string, EndpointHandler>();
      methodSpecificMap.set(path, func);
      this.endpointGroups.set(method, methodSpecificMap);
    } else {
      endpointGroup.set(path, func);
    }
  }

  public start(
    host: string,
    port: number,
    requestCallback?: (ip: string, method: Method, path?: string) => void,
  ): void {
    Bun.serve({
      port,
      hostname: host,
      fetch: (req: Request, server: Server) => {
        const url = parseUrl(req.url);
        if (requestCallback !== undefined) {
          requestCallback("", req.method as Method, url?.path);
        }

        if (url === null) {
          return new Response("Internal server error", { status: 500 });
        }
        return this.handleRequest(req, url, req.method as Method);
      },
    });
  }
}
