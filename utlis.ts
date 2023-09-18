export type KeyValue = {
  [key: string]: string | number;
};

const query: KeyValue = { hello: "world" };

export type Protocol = "http" | "https";

export type URL = {
  protocol?: Protocol;
  domain?: string;
  path?: string;
  query?: KeyValue;
};

export function parseQuery(rawQuery: string): KeyValue | undefined {
  if (rawQuery === null || rawQuery === undefined) {
    return undefined;
  }

  const query = rawQuery.substring(1);
  const keyValuePairs = query.split("&");
  const parsedQuery: KeyValue = {};
  keyValuePairs.forEach((kvp) => {
    const kv = kvp.split("=");
    parsedQuery[kv[0] as string] = kv[1];
  });
  return parsedQuery;
}

export function parseUrl(url: string): URL | null {
  const urlParts = url.match(
    /^(\w+):\/\/([^\/]+)(\/[^?#]*)?(\?[^#]*)?(#.*)?$/,
  );

  if (urlParts === null) {
    return null;
  }

  const protocol = urlParts[1];
  const domain = urlParts[2];
  const path = urlParts[3];
  const query = urlParts[4];
  const fragment = urlParts[5];

  return {
    protocol: protocol !== undefined ? protocol as Protocol : undefined,
    domain,
    path,
    query: parseQuery(query),
  };
}
