/* tslint:disable */
/* eslint-disable */

/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface User {
  username?: string;
  uuid?: string;
}

export interface Repository {
  slug?: string;
  owner?: User;
}

export interface Pullrequest {
  id?: number;
  title?: string;
  repository?: Repository;
  author?: User;
}

export type RequestParams = Omit<RequestInit, "body" | "method"> & {
  secure?: boolean;
};

export type RequestQueryParamsType = Record<string | number, any>;

type ApiConfig<SecurityDataType> = {
  baseUrl?: string;
  baseApiParams?: RequestParams;
  securityWorker?: (securityData: SecurityDataType) => RequestParams;
};

enum BodyType {
  Json,
}

class HttpClient<SecurityDataType> {
  public baseUrl: string = "";
  private securityData: SecurityDataType = null as any;
  private securityWorker: ApiConfig<SecurityDataType>["securityWorker"] = (() => {}) as any;

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor({ baseUrl, baseApiParams, securityWorker }: ApiConfig<SecurityDataType> = {}) {
    this.baseUrl = baseUrl || this.baseUrl;
    this.baseApiParams = baseApiParams || this.baseApiParams;
    this.securityWorker = securityWorker || this.securityWorker;
  }

  public setSecurityData = (data: SecurityDataType) => {
    this.securityData = data;
  };

  private addQueryParam(query: RequestQueryParamsType, key: string) {
    return (
      encodeURIComponent(key) + "=" + encodeURIComponent(Array.isArray(query[key]) ? query[key].join(",") : query[key])
    );
  }

  protected addQueryParams(rawQuery?: RequestQueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys.length
      ? `?${keys
          .map((key) =>
            typeof query[key] === "object" && !Array.isArray(query[key])
              ? this.addQueryParams(query[key] as object).substring(1)
              : this.addQueryParam(query, key),
          )
          .join("&")}`
      : "";
  }

  private bodyFormatters: Record<BodyType, (input: any) => any> = {
    [BodyType.Json]: JSON.stringify,
  };

  private mergeRequestOptions(params: RequestParams, securityParams?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params,
      ...(securityParams || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params.headers || {}),
        ...((securityParams && securityParams.headers) || {}),
      },
    };
  }

  private safeParseResponse = <T = any, E = any>(response: Response): Promise<T> =>
    response
      .json()
      .then((data) => data)
      .catch((e) => response.text);

  public request = <T = any, E = any>(
    path: string,
    method: string,
    { secure, ...params }: RequestParams = {},
    body?: any,
    bodyType?: BodyType,
    secureByDefault?: boolean,
  ): Promise<T> =>
    fetch(`${this.baseUrl}${path}`, {
      // @ts-ignore
      ...this.mergeRequestOptions(params, (secureByDefault || secure) && this.securityWorker(this.securityData)),
      method,
      body: body ? this.bodyFormatters[bodyType || BodyType.Json](body) : null,
    }).then(async (response) => {
      const data = await this.safeParseResponse<T, E>(response);
      if (!response.ok) throw data;
      return data;
    });
}

/**
 * @title Link Example
 * @version 1.0.0
 */
export class Api<SecurityDataType = any> extends HttpClient<SecurityDataType> {
  v20 = {
    /**
     * @name getUserByName
     * @request GET:/2.0/users/{username}
     */
    getUserByName: (username: string, params?: RequestParams) =>
      this.request<User, any>(`/2.0/users/${username}`, "GET", params),

    /**
     * @name getRepositoriesByOwner
     * @request GET:/2.0/repositories/{username}
     */
    getRepositoriesByOwner: (username: string, params?: RequestParams) =>
      this.request<Repository[], any>(`/2.0/repositories/${username}`, "GET", params),

    /**
     * @name getRepository
     * @request GET:/2.0/repositories/{username}/{slug}
     */
    getRepository: (username: string, slug: string, params?: RequestParams) =>
      this.request<Repository, any>(`/2.0/repositories/${username}/${slug}`, "GET", params),

    /**
     * @name getPullRequestsByRepository
     * @request GET:/2.0/repositories/{username}/{slug}/pullrequests
     */
    getPullRequestsByRepository: (
      username: string,
      slug: string,
      query?: { state?: "open" | "merged" | "declined" },
      params?: RequestParams,
    ) =>
      this.request<Pullrequest[], any>(
        `/2.0/repositories/${username}/${slug}/pullrequests${this.addQueryParams(query)}`,
        "GET",
        params,
      ),

    /**
     * @name getPullRequestsById
     * @request GET:/2.0/repositories/{username}/{slug}/pullrequests/{pid}
     */
    getPullRequestsById: (username: string, slug: string, pid: string, params?: RequestParams) =>
      this.request<Pullrequest, any>(`/2.0/repositories/${username}/${slug}/pullrequests/${pid}`, "GET", params),

    /**
     * @name mergePullRequest
     * @request POST:/2.0/repositories/{username}/{slug}/pullrequests/{pid}/merge
     */
    mergePullRequest: (username: string, slug: string, pid: string, params?: RequestParams) =>
      this.request<any, any>(`/2.0/repositories/${username}/${slug}/pullrequests/${pid}/merge`, "POST", params),
  };
}
