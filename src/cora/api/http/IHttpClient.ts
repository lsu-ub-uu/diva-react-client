export interface IHttpClient {
	get<T>(parameters: IHttpClientRequestParameters): Promise<T>;
}

export interface IHttpClientRequestParameters {
	url: string;
}
