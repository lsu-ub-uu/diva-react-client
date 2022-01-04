import httpClient from '../../../src/control/HttpClient';
import searchPersonsByNameSearch from '../../../src/control/api/searchPersonByNameSearch';
import { threePersonObjects } from '../../../testData/personData';

jest.mock('../../../src/control/HttpClient');

const mockHttpClientGet = httpClient.get as jest.MockedFunction<
	typeof httpClient.get
>;

describe('searchPersonsByNameSearch', () => {
	beforeAll(() => {
		process.env.BASE_URL = 'baseUrl/';
		mockHttpClientGet.mockResolvedValue(threePersonObjects);
	});

	it('should exist and take searchTerm, start and rows', () => {
		searchPersonsByNameSearch('someSearchTerm', 1, 20);
	});

	it('start and rows should be optional', () => {
		searchPersonsByNameSearch('someSearchTerm');
	});

	it('should reject with error if empty searchTerm given and not call httpClient', async () => {
		expect.assertions(2);

		try {
			await searchPersonsByNameSearch('');
		} catch (error: unknown) {
			const castError: Error = <Error>error;
			expect(castError.message).toStrictEqual(
				'No searchTerm was passed to searchPersonsByNameSearch'
			);
			expect(mockHttpClientGet).toHaveBeenCalledTimes(0);
		}
	});

	it('should correctly call httpClient if only searchTerm provided', async () => {
		const searchTerm = 'someSearchTerm';
		const searchEndpoint = 'record/searchResult/';
		const nameSearch = `publicPersonSearch?searchData={"name":"search","children":[{"name":"include","children":[{"name":"includePart","children":[{"name":"personNameSearchTerm","value":"${searchTerm}"}]}]}]}`;
		const expectedUrl = process.env.BASE_URL + searchEndpoint + nameSearch;

		expect.assertions(2);

		await searchPersonsByNameSearch('someSearchTerm');

		expect(mockHttpClientGet).toHaveBeenCalledTimes(1);
		expect(mockHttpClientGet).toHaveBeenCalledWith(
			expect.objectContaining({
				url: expectedUrl,
			})
		);
	});

	it.todo('should call personConverter for each person in dataList');
	it.todo(
		'should return List containing array of persons as well as from/to/max from dataList'
	);

	it('should reject with an error if HttpClient throws error', async () => {
		mockHttpClientGet.mockRejectedValueOnce(
			new Error('Some error from httpClient')
		);

		expect.assertions(6);

		try {
			await searchPersonsByNameSearch('someSearchTerm');
		} catch (error: unknown) {
			const castError: Error = <Error>error;
			expect(castError).toBeDefined();
			expect(castError.message).toStrictEqual('Some error from httpClient');
			expect(mockHttpClientGet).toHaveBeenCalledTimes(1);
		}

		mockHttpClientGet.mockRejectedValueOnce(
			new Error('Some other error from httpClient')
		);

		try {
			await searchPersonsByNameSearch('someSearchTerm');
		} catch (error: unknown) {
			const castError: Error = <Error>error;
			expect(castError).toBeDefined();
			expect(castError.message).toStrictEqual(
				'Some other error from httpClient'
			);
			expect(mockHttpClientGet).toHaveBeenCalledTimes(2);
		}
	});
});
