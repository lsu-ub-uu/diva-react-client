import 'whatwg-fetch';
import api, {
	searchPersonsByNameSearch,
	getPersonById,
} from '../../src/control/api';
import Person from '../../src/control/Person';
import convertPerson from '../../src/converter/Converter';
import { DataListWrapper } from '../../src/converter/CoraData';
import {
	getDataListContainingFourPersons,
	getDataListContainingOnePerson,
	onePerson,
} from '../../testData/searchResults';

import httpClient from '../../src/control/HttpClient';

jest.mock('../../src/converter/Converter');

const mockConvertPerson = convertPerson as jest.MockedFunction<
	typeof convertPerson
>;

jest.mock('../../src/control/HttpClient');

const mockHttpClientGet = httpClient.get as jest.MockedFunction<
	typeof httpClient.get
>;

beforeAll(() => {
	mockHttpClientGet.mockResolvedValue(onePerson);
});

describe('Api', () => {
	it('should return the dummy persons', () => {
		const persons = api.getPersons();

		expect(persons[0].authorisedName.familyName).toBe('Anka');
		expect(persons[1].authorisedName.givenName).toBe('Gerd');
	});

	describe('searchPersonsByNameSearch', () => {
		beforeAll(() => {
			process.env.BASE_URL = 'baseUrl/';
		});

		beforeEach(() => {
			jest.clearAllTimers();
			jest.clearAllMocks();
			window.fetch = jest.fn().mockImplementation(() =>
				Promise.resolve({
					ok: true,
					json: async () => ({
						dataList: {
							data: [],
						},
					}),
				})
			);
		});

		it('Calls fetch with correct parameters', async () => {
			const searchTerm = 'someSearchTerm';
			const searchEndpoint = 'record/searchResult/';
			const nameSearch = `publicPersonSearch?searchData={"name":"search","children":[{"name":"include","children":[{"name":"includePart","children":[{"name":"personNameSearchTerm","value":"${searchTerm}"}]}]}]}`;
			const expectedFetchURL =
				process.env.BASE_URL + searchEndpoint + nameSearch;

			searchPersonsByNameSearch('someSearchTerm');
			expect(window.fetch).toBeCalledTimes(1);
			expect(window.fetch).toHaveBeenLastCalledWith(expectedFetchURL);
		});

		it('Returns an empty list if it receives an empty list from API', async () => {
			const persons = await searchPersonsByNameSearch('someSearchTerm');

			expect(persons).toStrictEqual([]);
			expect(mockConvertPerson).toHaveBeenCalledTimes(0);
		});

		it('Returns a list containing one person if API returns one person', async () => {
			window.fetch = jest.fn().mockImplementation(() =>
				Promise.resolve({
					ok: true,
					json: async () => getDataListContainingOnePerson(),
				})
			);

			const persons = await searchPersonsByNameSearch('someSearchTerm');

			expect(persons).toHaveLength(1);
		});

		it('Sends dataGroup to convertPerson and returns an array containing the person returned by convertPerson', async () => {
			window.fetch = jest.fn().mockImplementation(() =>
				Promise.resolve({
					ok: true,
					json: async () => getDataListContainingOnePerson(),
				})
			);

			const expectedPerson: Person = new Person('someId', {
				familyName: 'SomeFamilyName',
				givenName: 'SomeGivenName',
			});

			mockConvertPerson.mockReturnValue(expectedPerson);

			const persons: Person[] = await searchPersonsByNameSearch(
				'someSearchTerm'
			);

			expect(mockConvertPerson).toHaveBeenCalledTimes(1);
			expect(mockConvertPerson).toHaveBeenCalledWith(
				getDataListContainingOnePerson().dataList.data[0].record.data
			);

			expect(persons).toHaveLength(1);
			expect(persons[0]).toStrictEqual(expectedPerson);
		});

		it('Sends dataGroups to convertPerson and returns an array containing the persons returned by convertPerson', async () => {
			const dataListWrapper: DataListWrapper =
				getDataListContainingFourPersons();

			window.fetch = jest.fn().mockImplementation(() =>
				Promise.resolve({
					ok: true,
					json: async () => dataListWrapper,
				})
			);

			const expectedPersons: Person[] = createMockPersons(4);

			mockConvertPerson.mockReturnValueOnce(expectedPersons[0]);
			mockConvertPerson.mockReturnValueOnce(expectedPersons[1]);
			mockConvertPerson.mockReturnValueOnce(expectedPersons[2]);
			mockConvertPerson.mockReturnValueOnce(expectedPersons[3]);

			const persons: Person[] = await searchPersonsByNameSearch(
				'someSearchTerm'
			);

			expect(mockConvertPerson).toHaveBeenCalledTimes(4);
			expect(mockConvertPerson).toHaveBeenNthCalledWith(
				1,
				dataListWrapper.dataList.data[0].record.data
			);
			expect(mockConvertPerson).toHaveBeenNthCalledWith(
				3,
				dataListWrapper.dataList.data[2].record.data
			);

			expect(persons).toHaveLength(4);
			expect(persons[0]).toStrictEqual(expectedPersons[0]);
			expect(persons[3]).toStrictEqual(expectedPersons[3]);
		});
	});

	describe('getPersonById', () => {
		it('should exist and take an ID', () => {
			getPersonById('someId');
		});

		it('should reject with error if empty id given and not call httpClient', async () => {
			expect.assertions(2);

			try {
				await getPersonById('');
			} catch (error: unknown) {
				const castError: Error = <Error>error;
				expect(castError.message).toStrictEqual(
					'No id was passed to getPersonById.'
				);
				expect(mockHttpClientGet).toHaveBeenCalledTimes(0);
			}
		});

		it('should correctly call httpClient', async () => {
			const expectedUrl = 'baseUrl/record/person/someId';

			expect.assertions(2);

			await getPersonById('someId');

			expect(mockHttpClientGet).toHaveBeenCalledTimes(1);
			expect(mockHttpClientGet).toHaveBeenCalledWith(
				expect.objectContaining({
					url: expectedUrl,
				})
			);
		});

		it('should reject with an error if HttpClient throws error', async () => {
			mockHttpClientGet.mockRejectedValueOnce(
				new Error('Some error from httpClient')
			);

			expect.assertions(2);

			try {
				await getPersonById('someId');
			} catch (error: unknown) {
				const castError: Error = <Error>error;
				expect(mockHttpClientGet).toHaveBeenCalledTimes(1);
				expect(castError.message).toStrictEqual('Some error from httpClient');
			}
		});

		it('should pass recordData received from httpClient to convertPerson', async () => {
			expect.assertions(2);

			await getPersonById('someId');

			expect(mockConvertPerson).toHaveBeenCalledTimes(1);
			expect(mockConvertPerson).toHaveBeenCalledWith(onePerson.record.data);
		});

		it('should resolve with a person if a person could be found', async () => {
			const expectedPersons: Person[] = createMockPersons(1);

			mockConvertPerson.mockReturnValueOnce(expectedPersons[0]);

			expect.assertions(1);

			const person: Person = await getPersonById('someId');

			expect(person).toStrictEqual(expectedPersons[0]);
		});
	});
});

function createMockPersons(amount: number): Person[] {
	const mockPersons: Person[] = [];
	for (let index = 0; index < amount; index += 1) {
		mockPersons.push(
			new Person(`someId-${index}`, {
				familyName: `SomeFamilyName${index}`,
				givenName: `SomeGivenName${index}`,
			})
		);
	}
	return mockPersons;
}
