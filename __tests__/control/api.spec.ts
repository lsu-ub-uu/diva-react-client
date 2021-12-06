import 'whatwg-fetch';
import api, { searchPersonsByNameSearch } from '../../src/control/api';
import Person from '../../src/control/Person';
import convertPerson from '../../src/converter/Converter';
import { DataListWrapper } from '../../src/converter/CoraData';
import {
	getDataListContainingFourPersons,
	getDataListContainingOnePerson,
} from '../../testData/searchResults';

jest.mock('../../src/converter/Converter');

const mockConvertPerson = convertPerson as jest.MockedFunction<
	typeof convertPerson
>;

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

			const expectedPerson: Person = {
				authorisedName: {
					familyName: 'SomeFamilyName',
					givenName: 'SomeGivenName',
				},
				id: 'someId',
			};

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
});

function createMockPersons(amount: number): Person[] {
	const mockPersons: Person[] = [];
	for (let index = 0; index < amount; index += 1) {
		mockPersons.push({
			authorisedName: {
				familyName: `SomeFamilyName${index}`,
				givenName: `SomeGivenName${index}`,
			},
			id: `someId-${index}`,
		});
	}
	return mockPersons;
}