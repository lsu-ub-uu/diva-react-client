import axios, { AxiosError } from 'axios';
import { IHttpClient, IHttpClientRequestParameters } from './IHttpClient';

class HttpClient implements IHttpClient {
	get<T>(parameters: IHttpClientRequestParameters): Promise<T> {
		return new Promise<T>((resolve, reject) => {
			const { url, authToken } = parameters;
			if (url === '') {
				reject(new Error('No URL given.'));
			} else {
				let axiosRequestConfig = {};
				if (authToken !== undefined) {
					axiosRequestConfig = {
						headers: { authToken },
					};
				}
				axios
					.get(url, axiosRequestConfig)
					.then((response: any) => {
						resolve(response.data as T);
					})
					.catch((error: unknown) => {
						const axiosError: AxiosError = <AxiosError>error;
						if (axiosError.response) {
							reject(
								new Error(
									`Request returned status code ${axiosError.response.status} with message '${axiosError.response.data}'`
								)
							);
						} else if (axiosError.request) {
							reject(
								new Error(
									`The request was made to URL '${url}' but no response was received.`
								)
							);
						} else {
							reject(new Error(axiosError.message));
						}
					});
			}
		});
	}
}

const httpClient = new HttpClient();

export default httpClient;
