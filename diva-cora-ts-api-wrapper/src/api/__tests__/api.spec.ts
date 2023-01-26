import 'whatwg-fetch';
import {
	searchPersonsByGeneralSearch as searchPersonsByGeneralSearchExport,
	getRecordById,
	getRecords,
} from '../api';
import { searchPersonsByGeneralSearch } from '../api/searchPersonByGeneralSearch';

import httpClient from '../http/HttpClient';
import { Person } from '../../types/Person';
import {
	onePerson,
	getDataListContainingFourPersons,
} from '../../../testData/searchResults';
import convertToObjectWithRecordType from '../../converter/RecordTypeConverter';
import {
	createCompletePerson,
	createListWithRecords,
} from '../../../testData/personObjectData';
import { PersonDomainPart } from '../../types/PersonDomainPart';
import { RecordType } from '../../types/Record';
import extractListFromDataList from '../api/DataListHandler';
import {
	dataListWithThreeRecords,
	dataListWithTwoRecords,
} from '../../../testData/dataLists';

jest.mock('../api/DataListHandler');
const mockExtractListFromDataList =
	extractListFromDataList as jest.MockedFunction<
		typeof extractListFromDataList
	>;

jest.mock('../../converter/RecordTypeConverter');
const mockConvertToObjectWithRecordType =
	convertToObjectWithRecordType as jest.MockedFunction<
		typeof convertToObjectWithRecordType
	>;

jest.mock('../http/HttpClient');
const mockHttpClientGet = httpClient.get as jest.MockedFunction<
	typeof httpClient.get
>;

const twoRecordsArray = [
	{
		id: 'someId1',
		recordType: 'loginWebRedirect1',
		url: 'someUrl1',
	},
	{
		id: 'someId2',
		recordType: 'loginWebRedirect2',
		url: 'someUrl2',
	},
];

const listWithTwoRecords = createListWithRecords(twoRecordsArray);

beforeAll(() => {
	mockHttpClientGet.mockResolvedValue(onePerson);
	// process.env.REST_API_BASE_URL = 'baseUrl/';
	process.env.REST_API_BASE_URL = 'baseUrl/';
	// console.log('aaaaaa', process.env.REST_API_BASE_URL);
	mockExtractListFromDataList.mockReturnValue(listWithTwoRecords);
});

describe('Api', () => {
	it('should re-export searchPersonsByGeneralSearch', () => {
		expect(searchPersonsByGeneralSearch).toStrictEqual(
			searchPersonsByGeneralSearchExport
		);
	});

	describe('getRecordById', () => {
		describe('parameters', () => {
			it('should take a RecordType, an ID and optionally an authToken', () => {
				getRecordById(RecordType.Person, 'someId');
				getRecordById(RecordType.Person, 'someId', 'someAuthToken');
			});

			it('should reject with error if empty id given and not call httpClient', async () => {
				expect.assertions(2);

				try {
					await getRecordById(RecordType.Person, '');
				} catch (error: unknown) {
					const castError: Error = <Error>error;
					expect(castError.message).toStrictEqual(
						'getRecordById was called with recordType person but no id.'
					);
					expect(mockHttpClientGet).toHaveBeenCalledTimes(0);
				}
			});

			it('should reject with error if empty id given and not call httpClient, recordType in message should reflect the parameter', async () => {
				expect.assertions(2);

				try {
					await getRecordById(RecordType.PersonDomainPart, '');
				} catch (error: unknown) {
					const castError: Error = <Error>error;
					expect(castError.message).toStrictEqual(
						'getRecordById was called with recordType personDomainPart but no id.'
					);
					expect(mockHttpClientGet).toHaveBeenCalledTimes(0);
				}
			});
		});

		it('should correctly call httpClient with id', async () => {
			const expectedUrl =
				'https://cora.test.diva-portal.org/diva/rest/record/person/someId';

			expect.assertions(2);

			await getRecordById(RecordType.Person, 'someId');

			expect(mockHttpClientGet).toHaveBeenCalledTimes(1);
			expect(mockHttpClientGet).toHaveBeenCalledWith(
				expect.objectContaining({
					url: expectedUrl,
				})
			);
		});

		it('should correctly call httpClient with recordType', async () => {
			const expectedUrl =
				'https://cora.test.diva-portal.org/diva/rest/record/personDomainPart/someId';

			expect.assertions(2);

			await getRecordById(RecordType.PersonDomainPart, 'someId');

			expect(mockHttpClientGet).toHaveBeenCalledTimes(1);
			expect(mockHttpClientGet).toHaveBeenCalledWith(
				expect.objectContaining({
					url: expectedUrl,
				})
			);
		});

		it('should correctly call httpClient with authToken', async () => {
			expect.assertions(4);

			await getRecordById(
				RecordType.PersonDomainPart,
				'someId',
				'someToken'
			);

			expect(mockHttpClientGet).toHaveBeenCalledTimes(1);
			expect(mockHttpClientGet).toHaveBeenLastCalledWith(
				expect.objectContaining({
					url: expect.any(String),
					authToken: 'someToken',
				})
			);

			await getRecordById(
				RecordType.PersonDomainPart,
				'someId',
				'someOtherToken'
			);

			expect(mockHttpClientGet).toHaveBeenCalledTimes(2);
			expect(mockHttpClientGet).toHaveBeenLastCalledWith(
				expect.objectContaining({
					url: expect.any(String),
					authToken: 'someOtherToken',
				})
			);
		});

		it('should reject with an error if HttpClient throws error', async () => {
			mockHttpClientGet.mockRejectedValueOnce(
				new Error('Some error from httpClient')
			);

			expect.assertions(2);

			try {
				await getRecordById(RecordType.PersonDomainPart, 'someId');
			} catch (error: unknown) {
				const castError: Error = <Error>error;
				expect(mockHttpClientGet).toHaveBeenCalledTimes(1);
				expect(castError.message).toStrictEqual(
					'Some error from httpClient'
				);
			}
		});

		it('should pass recordData received from httpClient to convertToObject', async () => {
			mockHttpClientGet.mockResolvedValueOnce(onePerson);
			expect.assertions(4);

			await getRecordById(RecordType.Person, 'someId');

			expect(mockConvertToObjectWithRecordType).toHaveBeenCalledTimes(1);
			expect(mockConvertToObjectWithRecordType).toHaveBeenCalledWith(
				onePerson.record.data,
				expect.any(String)
			);

			const anotherPerson =
				getDataListContainingFourPersons().dataList.data[2];
			mockHttpClientGet.mockResolvedValueOnce(anotherPerson);

			await getRecordById(RecordType.Person, 'someId');

			expect(mockConvertToObjectWithRecordType).toHaveBeenCalledTimes(2);
			expect(mockConvertToObjectWithRecordType).toHaveBeenCalledWith(
				anotherPerson.record.data,
				expect.any(String)
			);
		});

		it('should pass recordType to convertToObject', async () => {
			expect.assertions(4);

			await getRecordById(RecordType.Person, 'someId');

			expect(mockConvertToObjectWithRecordType).toHaveBeenCalledTimes(1);
			expect(mockConvertToObjectWithRecordType).toHaveBeenCalledWith(
				expect.any(Object),
				RecordType.Person
			);

			await getRecordById(RecordType.PersonDomainPart, 'someId');

			expect(mockConvertToObjectWithRecordType).toHaveBeenCalledTimes(2);
			expect(mockConvertToObjectWithRecordType).toHaveBeenCalledWith(
				expect.any(Object),
				RecordType.PersonDomainPart
			);
		});

		it('should resolve with an object of type T if one could be found', async () => {
			const expectedPerson = createCompletePerson();

			mockConvertToObjectWithRecordType.mockReturnValueOnce(
				expectedPerson
			);

			expect.assertions(1);

			const person: Person = await getRecordById<Person>(
				RecordType.Person,
				'someId'
			);

			expect(person).toStrictEqual(expectedPerson);
		});

		it('should resolve with an object of type T if one could be found', async () => {
			const expectedPersonDomainPart: PersonDomainPart = {
				id: 'someId',
				recordType: 'personDomainPart',
				domain: 'someDomain',
				affiliations: [],
			};

			mockConvertToObjectWithRecordType.mockReturnValueOnce(
				expectedPersonDomainPart
			);

			expect.assertions(1);

			const returned: PersonDomainPart =
				await getRecordById<PersonDomainPart>(
					RecordType.PersonDomainPart,
					'someId'
				);

			expect(returned).toStrictEqual(expectedPersonDomainPart);
		});
	});

	describe('getRecords', () => {
		it('takes recordType and optional authToken', () => {
			getRecords(RecordType.LoginUnit);
			getRecords(RecordType.LoginUnit, 'someAuthToken');
		});

		it('should correctly call httpClient with recordType', async () => {
			let expectedUrl =
				'https://cora.test.diva-portal.org/diva/rest/record/loginUnit/';

			expect.assertions(4);

			await getRecords(RecordType.LoginUnit);

			expect(mockHttpClientGet).toHaveBeenCalledTimes(1);
			expect(mockHttpClientGet).toHaveBeenLastCalledWith(
				expect.objectContaining({
					url: expectedUrl,
				})
			);

			expectedUrl =
				'https://cora.test.diva-portal.org/diva/rest/record/loginWebRedirect/';

			await getRecords(RecordType.LoginWebRedirect);

			expect(mockHttpClientGet).toHaveBeenCalledTimes(2);
			expect(mockHttpClientGet).toHaveBeenLastCalledWith(
				expect.objectContaining({
					url: expectedUrl,
				})
			);
		});

		it('should correctly call httpClient with authToken', async () => {
			expect.assertions(4);

			await getRecords(RecordType.PersonDomainPart, 'someToken');

			expect(mockHttpClientGet).toHaveBeenCalledTimes(1);
			expect(mockHttpClientGet).toHaveBeenLastCalledWith(
				expect.objectContaining({
					url: expect.any(String),
					authToken: 'someToken',
				})
			);

			await getRecords(RecordType.PersonDomainPart, 'someOtherToken');

			expect(mockHttpClientGet).toHaveBeenCalledTimes(2);
			expect(mockHttpClientGet).toHaveBeenLastCalledWith(
				expect.objectContaining({
					url: expect.any(String),
					authToken: 'someOtherToken',
				})
			);
		});

		describe('if get resolves', () => {
			it('calls extractListFromDataList with whatever get returns', async () => {
				mockHttpClientGet.mockResolvedValueOnce(dataListWithTwoRecords);
				await getRecords(RecordType.PersonDomainPart);

				expect(mockExtractListFromDataList).toHaveBeenLastCalledWith(
					dataListWithTwoRecords,
					expect.any(String)
				);

				mockHttpClientGet.mockResolvedValueOnce(
					dataListWithThreeRecords
				);
				await getRecords(RecordType.PersonDomainPart);

				expect(mockExtractListFromDataList).toHaveBeenLastCalledWith(
					dataListWithThreeRecords,
					expect.any(String)
				);
			});
			it('calls extractListFromDataList with given RecordType', async () => {
				mockHttpClientGet.mockResolvedValueOnce(dataListWithTwoRecords);
				await getRecords(RecordType.PersonDomainPart);

				expect(mockExtractListFromDataList).toHaveBeenLastCalledWith(
					expect.any(Object),
					RecordType.PersonDomainPart
				);

				mockHttpClientGet.mockResolvedValueOnce(dataListWithTwoRecords);
				await getRecords(RecordType.LoginUnit);

				expect(mockExtractListFromDataList).toHaveBeenLastCalledWith(
					expect.any(Object),
					RecordType.LoginUnit
				);
			});
			it('resolves with whatever extractListFromDataList returns', async () => {
				expect.assertions(2);
				let list = await getRecords(RecordType.PersonDomainPart);

				expect(list).toStrictEqual(listWithTwoRecords);

				const emptyList = createListWithRecords([]);
				mockExtractListFromDataList.mockReturnValueOnce(emptyList);

				list = await getRecords(RecordType.PersonDomainPart);
				expect(list).toStrictEqual(emptyList);
			});
		});

		describe('if get rejects', () => {
			it('reject with the same error', async () => {
				const expectedError = new Error('someErrorFromGet');
				mockHttpClientGet.mockRejectedValueOnce(expectedError);

				try {
					await getRecords(RecordType.PersonDomainPart);
				} catch (error) {
					expect(error).toStrictEqual(expectedError);
				}
			});
		});
	});
});
