import 'whatwg-fetch';
import api, { searchPersonsByNameSearch } from '../src/control/api';
import convertPerson from '../src/converter/Converter';
import { getGerd } from '../testData/searchResults';

jest.mock('../src/converter/Converter');

const mockConvertPerson = convertPerson as jest.MockedFunction<
	typeof convertPerson
>;

describe('Api', () => {
	it('should return the dummy persons', () => {
		const persons = api.getPersons();

		expect(persons[0].authorisedName.familyName).toBe('Anka');
		expect(persons[1].authorisedName.givenName).toBe('Gerd');
	});

	// Mock fetch
	// Kolla att fetch anropas med rätt parametrar
	// 1. Kolla att om vi får tillbaka en tom lista, resolvas det med en tom lista
	// 2. om vi får ett element i svarslistan, se till att det skickas till en personConverter

	describe('searchPersonsByNameSearch', () => {
		beforeAll(() => {
			process.env.BASE_URL = 'baseUrl/';
			// jest.spyOn(window, 'fetch');
		});

		beforeEach(() => {
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
		});

		it('Returns a list containing one person if API returns one person', async () => {
			window.fetch = jest.fn().mockImplementation(() =>
				Promise.resolve({
					ok: true,
					json: async () => getGerd(),
				})
			);

			const persons = await searchPersonsByNameSearch('someSearchTerm');

			expect(persons).toHaveLength(1);
		});
	});
});
