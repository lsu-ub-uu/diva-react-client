import axios from 'axios';
import httpClient from '../HttpClient';
import { IHttpClientRequestParameters } from '../IHttpClient';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

beforeAll(() => {
	mockedAxios.get.mockResolvedValue({
		data: { someField: 'someDefaultData' },
	});
});

describe('The HttpClient', () => {
	describe('the get method', () => {
		it('should exist and take IHttpClientRequestParameters', () => {
			const parameters: IHttpClientRequestParameters = {
				url: 'someUrl',
				authToken: 'someAuthToken',
			};
			httpClient.get(parameters);
		});

		it('should call axios.get with url', async () => {
			const parameters: IHttpClientRequestParameters = {
				url: 'someUrl',
			};

			expect.assertions(4);

			await httpClient.get(parameters);

			expect(mockedAxios.get).toHaveBeenCalledTimes(1);
			expect(mockedAxios.get).toHaveBeenCalledWith(parameters.url, {});

			const parameters2: IHttpClientRequestParameters = {
				url: 'someOtherUrl',
			};
			httpClient.get(parameters2);

			expect(mockedAxios.get).toHaveBeenCalledTimes(2);
			expect(mockedAxios.get).toHaveBeenCalledWith(parameters2.url, {});
		});

		it('should call axios.get with authToken if authToken set', async () => {
			const parameters: IHttpClientRequestParameters = {
				url: 'someUrl',
				authToken: 'someAuthToken',
			};

			expect.assertions(4);

			await httpClient.get(parameters);

			expect(mockedAxios.get).toHaveBeenCalledTimes(1);
			expect(mockedAxios.get).toHaveBeenCalledWith(parameters.url, {
				headers: { authToken: 'someAuthToken' },
			});

			const parameters2: IHttpClientRequestParameters = {
				url: 'someOtherUrl',
				authToken: 'someOtherToken',
			};
			httpClient.get(parameters2);

			expect(mockedAxios.get).toHaveBeenCalledTimes(2);
			expect(mockedAxios.get).toHaveBeenCalledWith(parameters2.url, {
				headers: { authToken: 'someOtherToken' },
			});
		});

		it('should reject with error if url is empty', async () => {
			const parameters: IHttpClientRequestParameters = {
				url: '',
			};

			expect.assertions(1);
			try {
				await httpClient.get(parameters);
			} catch (error: unknown) {
				const castError: Error = <Error>error;
				expect(castError.message).toMatch('No URL given.');
			}
		});

		it('should not call axios.get if url is empty', async () => {
			const parameters: IHttpClientRequestParameters = {
				url: '',
			};

			expect.assertions(2);
			try {
				await httpClient.get(parameters);
			} catch (error: unknown) {
				const castError: Error = <Error>error;
				expect(castError.message).toStrictEqual('No URL given.');
				expect(mockedAxios.get).toHaveBeenCalledTimes(0);
			}
		});

		it('should return data from axios if call is successful', async () => {
			const parameters: IHttpClientRequestParameters = {
				url: 'someUrl',
			};
			expect.assertions(1);

			const data = await httpClient.get(parameters);

			expect(data).toStrictEqual({ someField: 'someDefaultData' });
		});

		describe('should handle axios errors', () => {
			it('should reject with error if axios throws with response', async () => {
				mockedAxios.get.mockRejectedValueOnce({
					response: {
						data: 'Some error message',
						status: 404,
						headers: {},
					},
					request: 'XMLHttpRequest',
					message: 'Some general error message',
				});

				const parameters: IHttpClientRequestParameters = {
					url: 'someUrl',
				};

				expect.assertions(1);
				try {
					await httpClient.get(parameters);
				} catch (error: unknown) {
					const castError: Error = <Error>error;
					expect(castError.message).toStrictEqual(
						"Request returned status code 404 with message 'Some error message'"
					);
				}
			});

			it('should reject with error if axios throws with XMLHttpRequest', async () => {
				mockedAxios.get.mockRejectedValueOnce({
					request: 'XMLHttpRequest',
					message: 'Some general error message',
				});

				const parameters: IHttpClientRequestParameters = {
					url: 'someUrl',
				};

				expect.assertions(2);
				try {
					await httpClient.get(parameters);
				} catch (error: unknown) {
					const castError: Error = <Error>error;
					expect(castError.message).toStrictEqual(
						"The request was made to URL 'someUrl' but no response was received."
					);
				}

				mockedAxios.get.mockRejectedValueOnce({
					request: 'XMLHttpRequest',
					message: 'Some general error message',
				});

				const parameters2: IHttpClientRequestParameters = {
					url: 'someOtherUrl',
				};

				try {
					await httpClient.get(parameters2);
				} catch (error: unknown) {
					const castError: Error = <Error>error;
					expect(castError.message).toStrictEqual(
						"The request was made to URL 'someOtherUrl' but no response was received."
					);
				}
			});

			it('should reject with error if axios throws general error', async () => {
				mockedAxios.get.mockRejectedValueOnce({
					message: 'Some general error message.',
				});

				const parameters: IHttpClientRequestParameters = {
					url: 'someUrl',
				};

				expect.assertions(1);
				try {
					await httpClient.get(parameters);
				} catch (error: unknown) {
					const castError: Error = <Error>error;
					expect(castError.message).toStrictEqual(
						'Some general error message.'
					);
				}
			});
		});
	});
});
