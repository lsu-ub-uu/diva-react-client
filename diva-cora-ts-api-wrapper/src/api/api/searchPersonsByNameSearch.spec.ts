import httpClient from '../http/HttpClient';
import searchPersonsByNameSearch from './searchPersonByNameSearch';
import { List } from '../../types/List';
import convertToObject from '../../converter/Converter';
import { personMatcher } from '../../converter/definitions/PersonDefinitions';
import {
	dataListContainingFourPersons,
	dataListContainingTwoOfFifteen,
	dataListContainingOnePerson,
} from '../../../testData/searchResults';

jest.mock('../http/HttpClient');

const mockHttpClientGet = httpClient.get as jest.MockedFunction<
	typeof httpClient.get
>;

jest.mock('../../converter/Converter');
const mockConvertToObject = convertToObject as jest.MockedFunction<
	typeof convertToObject
>;

const searchTerm = 'someSearchTerm';
const searchEndpoint = 'record/searchResult/';

describe('searchPersonsByNameSearch', () => {
	beforeAll(() => {
		process.env.BASE_URL = 'baseUrl/';
		mockHttpClientGet.mockResolvedValue(dataListContainingOnePerson);
	});

	it('should exist and take searchTerm, start and rows and optional authToken', () => {
		searchPersonsByNameSearch('someSearchTerm', 1, 20);
		searchPersonsByNameSearch('someSearchTerm', 1, 20, 'someAuthToken');
	});

	it('should reject with error if empty searchTerm given and not call httpClient', async () => {
		expect.assertions(2);

		try {
			await searchPersonsByNameSearch('', 1, 2);
		} catch (error: unknown) {
			const castError: Error = <Error>error;
			expect(castError.message).toStrictEqual(
				'No searchTerm was passed to searchPersonsByNameSearch'
			);
			expect(mockHttpClientGet).toHaveBeenCalledTimes(0);
		}
	});

	it('should correctly call httpClient with parameters', async () => {
		const nameSearch = `publicPersonSearch?searchData={"name":"search","children":[{"name":"include","children":[{"name":"includePart","children":[{"name":"personNameSearchTerm","value":"${searchTerm}"}]}]},{"name":"start","value":"1"},{"name":"rows","value":"2"}]}`;
		const expectedUrl = process.env.BASE_URL + searchEndpoint + nameSearch;

		expect.assertions(2);

		await searchPersonsByNameSearch('someSearchTerm', 1, 2);

		expect(mockHttpClientGet).toHaveBeenCalledTimes(1);
		expect(mockHttpClientGet).toHaveBeenCalledWith(
			expect.objectContaining({
				url: expectedUrl,
			})
		);
	});

	it('should return empty list if httpClient returns with empty dataList, convertPerson should not have been called', async () => {
		mockHttpClientGet.mockResolvedValueOnce({
			dataList: {
				fromNo: '1',
				data: [],
				totalNo: '0',
				toNo: '0',
			},
		});

		expect.assertions(5);

		const returnedList: List = await searchPersonsByNameSearch(
			'someSearchTerm',
			1,
			2
		);

		expect(returnedList.data).toHaveLength(0);
		expect(returnedList.fromNumber).toStrictEqual(1);
		expect(returnedList.totalNumber).toStrictEqual(0);
		expect(returnedList.toNumber).toStrictEqual(0);

		expect(mockConvertToObject).not.toHaveBeenCalled();
	});

	describe('transformation to Person', () => {
		it('should call convertToObject once with correct data if httpClient resolves with dataList of size 1', async () => {
			mockHttpClientGet.mockResolvedValueOnce(dataListContainingOnePerson);

			expect.assertions(2);

			await searchPersonsByNameSearch('someSearchTerm', 1, 2);

			expect(mockConvertToObject).toHaveBeenCalledTimes(1);
			expect(mockConvertToObject).toHaveBeenCalledWith(
				dataListContainingOnePerson.dataList.data[0].record.data,
				personMatcher
			);
		});

		it('should call convertToObject for each person in dataList', async () => {
			mockHttpClientGet.mockResolvedValueOnce(dataListContainingFourPersons);

			expect.assertions(3);

			await searchPersonsByNameSearch('someSearchTerm', 1, 2);
			expect(mockConvertToObject).toHaveBeenCalledTimes(4);
			expect(mockConvertToObject).toHaveBeenNthCalledWith(
				1,
				dataListContainingFourPersons.dataList.data[0].record.data,
				personMatcher
			);
			expect(mockConvertToObject).toHaveBeenNthCalledWith(
				4,
				dataListContainingFourPersons.dataList.data[3].record.data,
				personMatcher
			);
		});
	});

	it('should return List containing array of persons as well as from/to/total from dataList', async () => {
		mockHttpClientGet.mockResolvedValueOnce(dataListContainingFourPersons);

		expect.assertions(5);

		const list: List = await searchPersonsByNameSearch('someSearchTerm', 1, 2);

		expect(mockConvertToObject).toHaveBeenCalledTimes(4);

		expect(list.data).toHaveLength(4);
		expect(list.fromNumber).toStrictEqual(1);
		expect(list.toNumber).toStrictEqual(4);
		expect(list.totalNumber).toStrictEqual(4);
	});

	it('should set from/to/total accordingly', async () => {
		mockHttpClientGet.mockResolvedValueOnce(dataListContainingTwoOfFifteen);

		expect.assertions(4);

		const list: List = await searchPersonsByNameSearch('someSearchTerm', 1, 2);

		expect(mockConvertToObject).toHaveBeenCalledTimes(2);
		expect(list.fromNumber).toStrictEqual(3);
		expect(list.toNumber).toStrictEqual(4);
		expect(list.totalNumber).toStrictEqual(15);
	});

	it('should pass start', async () => {
		const nameSearch = `publicPersonSearch?searchData={"name":"search","children":[{"name":"include","children":[{"name":"includePart","children":[{"name":"personNameSearchTerm","value":"${searchTerm}"}]}]},{"name":"start","value":"2"},{"name":"rows","value":"3"}]}`;
		const expectedUrl = process.env.BASE_URL + searchEndpoint + nameSearch;

		expect.assertions(2);

		await searchPersonsByNameSearch('someSearchTerm', 2, 3);

		expect(mockHttpClientGet).toHaveBeenCalledTimes(1);
		expect(mockHttpClientGet).toHaveBeenCalledWith(
			expect.objectContaining({
				url: expectedUrl,
			})
		);
	});

	it('should pass rows', async () => {
		const nameSearch = `publicPersonSearch?searchData={"name":"search","children":[{"name":"include","children":[{"name":"includePart","children":[{"name":"personNameSearchTerm","value":"${searchTerm}"}]}]},{"name":"start","value":"3"},{"name":"rows","value":"4"}]}`;
		const expectedUrl = process.env.BASE_URL + searchEndpoint + nameSearch;

		expect.assertions(2);

		await searchPersonsByNameSearch('someSearchTerm', 3, 4);

		expect(mockHttpClientGet).toHaveBeenCalledTimes(1);
		expect(mockHttpClientGet).toHaveBeenCalledWith(
			expect.objectContaining({
				url: expectedUrl,
			})
		);
	});

	it('should not pass start if start is 0', async () => {
		const nameSearch = `publicPersonSearch?searchData={"name":"search","children":[{"name":"include","children":[{"name":"includePart","children":[{"name":"personNameSearchTerm","value":"${searchTerm}"}]}]},{"name":"rows","value":"4"}]}`;
		const expectedUrl = process.env.BASE_URL + searchEndpoint + nameSearch;

		expect.assertions(2);

		await searchPersonsByNameSearch('someSearchTerm', 0, 4);

		expect(mockHttpClientGet).toHaveBeenCalledTimes(1);
		expect(mockHttpClientGet).toHaveBeenCalledWith(
			expect.objectContaining({
				url: expectedUrl,
			})
		);
	});

	it('should not pass start if start is negative', async () => {
		const nameSearch = `publicPersonSearch?searchData={"name":"search","children":[{"name":"include","children":[{"name":"includePart","children":[{"name":"personNameSearchTerm","value":"${searchTerm}"}]}]},{"name":"rows","value":"4"}]}`;
		const expectedUrl = process.env.BASE_URL + searchEndpoint + nameSearch;

		expect.assertions(2);

		await searchPersonsByNameSearch('someSearchTerm', -1, 4);

		expect(mockHttpClientGet).toHaveBeenCalledTimes(1);
		expect(mockHttpClientGet).toHaveBeenCalledWith(
			expect.objectContaining({
				url: expectedUrl,
			})
		);
	});

	it('should not pass rows if rows is 0', async () => {
		const nameSearch = `publicPersonSearch?searchData={"name":"search","children":[{"name":"include","children":[{"name":"includePart","children":[{"name":"personNameSearchTerm","value":"${searchTerm}"}]}]},{"name":"start","value":"3"}]}`;
		const expectedUrl = process.env.BASE_URL + searchEndpoint + nameSearch;

		expect.assertions(2);

		await searchPersonsByNameSearch('someSearchTerm', 3, 0);

		expect(mockHttpClientGet).toHaveBeenCalledTimes(1);
		expect(mockHttpClientGet).toHaveBeenCalledWith(
			expect.objectContaining({
				url: expectedUrl,
			})
		);
	});

	it('should not pass rows if rows is negative', async () => {
		const nameSearch = `publicPersonSearch?searchData={"name":"search","children":[{"name":"include","children":[{"name":"includePart","children":[{"name":"personNameSearchTerm","value":"${searchTerm}"}]}]},{"name":"start","value":"3"}]}`;
		const expectedUrl = process.env.BASE_URL + searchEndpoint + nameSearch;

		expect.assertions(2);

		await searchPersonsByNameSearch('someSearchTerm', 3, -1);

		expect(mockHttpClientGet).toHaveBeenCalledTimes(1);
		expect(mockHttpClientGet).toHaveBeenCalledWith(
			expect.objectContaining({
				url: expectedUrl,
			})
		);
	});

	it('should authToken if defined', async () => {
		expect.assertions(4);

		await searchPersonsByNameSearch('someSearchTerm', 3, 4, 'someAuthToken');

		expect(mockHttpClientGet).toHaveBeenCalledTimes(1);
		expect(mockHttpClientGet).toHaveBeenCalledWith(
			expect.objectContaining({
				url: expect.any(String),
				authToken: 'someAuthToken',
			})
		);

		await searchPersonsByNameSearch(
			'someOtherSearchTerm',
			3,
			4,
			'someOtherAuthToken'
		);

		expect(mockHttpClientGet).toHaveBeenCalledTimes(2);
		expect(mockHttpClientGet).toHaveBeenCalledWith(
			expect.objectContaining({
				url: expect.any(String),
				authToken: 'someOtherAuthToken',
			})
		);
	});

	it('should reject with an error if HttpClient throws error', async () => {
		mockHttpClientGet.mockRejectedValueOnce(
			new Error('Some error from httpClient')
		);

		expect.assertions(6);

		try {
			await searchPersonsByNameSearch('someSearchTerm', 1, 5);
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
			await searchPersonsByNameSearch('someSearchTerm', 1, 5);
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
