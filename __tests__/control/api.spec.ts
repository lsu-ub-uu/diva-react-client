import 'whatwg-fetch';
import {
	searchPersonsByNameSearch as searchPersonsByNameSearchExport,
	getPersonById,
} from '../../src/control/api';
import searchPersonsByNameSearch from '../../src/control/api/searchPersonByNameSearch';
import { onePerson } from '../../testData/searchResults';

import httpClient from '../../src/control/HttpClient';
import convertToObject from '../../src/converter/Converter';
import {
	personMatcher,
	PersonObject,
} from '../../src/converter/Person/PersonDefinitions';

jest.mock('../../src/converter/Converter');
const mockConvertToObject = convertToObject as jest.MockedFunction<
	typeof convertToObject
>;

jest.mock('../../src/control/HttpClient');
const mockHttpClientGet = httpClient.get as jest.MockedFunction<
	typeof httpClient.get
>;

beforeAll(() => {
	mockHttpClientGet.mockResolvedValue(onePerson);
	process.env.BASE_URL = 'baseUrl/';
});

describe('Api', () => {
	it('should re-export searchPersonsByNameSearch', () => {
		expect(searchPersonsByNameSearch).toStrictEqual(
			searchPersonsByNameSearchExport
		);
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

		it('should pass recordData received from httpClient to convertPersonDataGroupToPerson', async () => {
			expect.assertions(2);

			await getPersonById('someId');

			expect(mockConvertToObject).toHaveBeenCalledTimes(1);
			expect(mockConvertToObject).toHaveBeenCalledWith(
				onePerson.record.data,
				personMatcher
			);
		});

		it('should resolve with a person if a person could be found', async () => {
			const expectedPersons: PersonObject[] = createMockPersons(1);

			mockConvertToObject.mockReturnValueOnce(expectedPersons[0]);

			expect.assertions(1);

			const person: PersonObject = await getPersonById('someId');

			expect(person).toStrictEqual(expectedPersons[0]);
		});
	});
});

function createMockPersons(amount: number): PersonObject[] {
	const mockPersons: PersonObject[] = [];
	for (let index = 0; index < amount; index += 1) {
		mockPersons.push({
			id: `someId-${index}`,
			authorisedName: {
				familyName: `SomeFamilyName${index}`,
				givenName: `SomeGivenName${index}`,
			},
			recordType: 'person',
		});
	}
	return mockPersons;
}
