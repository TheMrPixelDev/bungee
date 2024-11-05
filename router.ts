import { Method } from "./Server";

export type HandlerFunction = (request: Request) => Response;

export type Route = {
  name: string;
  subroutes: Route[];
  handler?: HandlerFunction;
};

export class App {
  private root: Map<Method, Route>;

  constructor() {
    this.root = new Map();
  }

  public get(path: string, handler: (request: Request) => Response) {
  }

  private addHandlerToMethod(
    method: Method,
    path: string,
    handler: HandlerFunction,
  ) {
    const splitPath = `index/${path}`.split("/");
    const methodsRouteTree = this.root.get(method);

    if (methodsRouteTree === undefined) {
      const indexRoute = {
        name: splitPath[0],
        subroutes: [],
        handler: splitPath.length === 1 ? handler : undefined,
      };
      this.root.set(method, indexRoute);
      this.buildRouteTree(indexRoute, splitPath.slice(1), handler);
    }

    this.buildRouteTree(methodsRouteTree, splitPath, handler);
  }

  private buildRouteTree(
    currentNode: Route,
    path: string[],
    handler: HandlerFunction,
  ) {
    if (path.length >= 2) {
      const nextNode = currentNode.subroutes.find((node) =>
        node.name === path[0]
      );

      if (nextNode === undefined) {
        currentNode.subroutes.push({
          name: path[0],
          subroutes: [],
          handler: path.length === 1 ? handler : undefined,
        });
      } else {
        this.buildRouteTree(nextNode, path.slice(1), handler);
      }
    }
  }
}
