// eslint-disable-next-line import/no-extraneous-dependencies
import 'whatwg-fetch';
import {
	searchPersonsByNameSearch as searchPersonsByNameSearchExport,
	getRecordById,
} from './api';
import searchPersonsByNameSearch from './api/searchPersonByNameSearch';

import httpClient from './http/HttpClient';
import { Person } from '../types/Person';
import {
	onePerson,
	getDataListContainingFourPersons,
} from '../../../testData/searchResults';
import SupportedRecordType from '../types/RecordTypes';
import convertToObjectWithRecordType from '../converter/RecordTypeConverter';
import { createCompletePerson } from '../../../testData/personObjectData';
import { PersonDomainPart } from '../types/PersonDomainPart';

jest.mock('../converter/RecordTypeConverter');
const mockConvertToObjectWithRecordType =
	convertToObjectWithRecordType as jest.MockedFunction<
		typeof convertToObjectWithRecordType
	>;

jest.mock('./http/HttpClient');
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

	describe('getRecordById', () => {
		describe('parameters', () => {
			it('should take a SupportedRecordType and an ID', () => {
				getRecordById(SupportedRecordType.Person, 'someId');
			});

			it('should reject with error if empty id given and not call httpClient', async () => {
				expect.assertions(2);

				try {
					await getRecordById(SupportedRecordType.Person, '');
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
					await getRecordById(SupportedRecordType.PersonDomainPart, '');
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
			const expectedUrl = 'baseUrl/record/person/someId';

			expect.assertions(2);

			await getRecordById(SupportedRecordType.Person, 'someId');

			expect(mockHttpClientGet).toHaveBeenCalledTimes(1);
			expect(mockHttpClientGet).toHaveBeenCalledWith(
				expect.objectContaining({
					url: expectedUrl,
				})
			);
		});

		it('should correctly call httpClient with recordType', async () => {
			const expectedUrl = 'baseUrl/record/personDomainPart/someId';

			expect.assertions(2);

			await getRecordById(SupportedRecordType.PersonDomainPart, 'someId');

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
				await getRecordById(SupportedRecordType.PersonDomainPart, 'someId');
			} catch (error: unknown) {
				const castError: Error = <Error>error;
				expect(mockHttpClientGet).toHaveBeenCalledTimes(1);
				expect(castError.message).toStrictEqual('Some error from httpClient');
			}
		});

		it('should pass recordData received from httpClient to convertToObject', async () => {
			mockHttpClientGet.mockResolvedValueOnce(onePerson);
			expect.assertions(4);

			await getRecordById(SupportedRecordType.Person, 'someId');

			expect(mockConvertToObjectWithRecordType).toHaveBeenCalledTimes(1);
			expect(mockConvertToObjectWithRecordType).toHaveBeenCalledWith(
				onePerson.record.data,
				expect.any(String)
			);

			const anotherPerson = getDataListContainingFourPersons().dataList.data[2];
			mockHttpClientGet.mockResolvedValueOnce(anotherPerson);

			await getRecordById(SupportedRecordType.Person, 'someId');

			expect(mockConvertToObjectWithRecordType).toHaveBeenCalledTimes(2);
			expect(mockConvertToObjectWithRecordType).toHaveBeenCalledWith(
				anotherPerson.record.data,
				expect.any(String)
			);
		});

		it('should pass recordType to convertToObject', async () => {
			expect.assertions(4);

			await getRecordById(SupportedRecordType.Person, 'someId');

			expect(mockConvertToObjectWithRecordType).toHaveBeenCalledTimes(1);
			expect(mockConvertToObjectWithRecordType).toHaveBeenCalledWith(
				expect.any(Object),
				SupportedRecordType.Person
			);

			await getRecordById(SupportedRecordType.PersonDomainPart, 'someId');

			expect(mockConvertToObjectWithRecordType).toHaveBeenCalledTimes(2);
			expect(mockConvertToObjectWithRecordType).toHaveBeenCalledWith(
				expect.any(Object),
				SupportedRecordType.PersonDomainPart
			);
		});

		it('should resolve with an object of type T if one could be found', async () => {
			const expectedPerson = createCompletePerson();

			mockConvertToObjectWithRecordType.mockReturnValueOnce(expectedPerson);

			expect.assertions(1);

			const person: Person = await getRecordById<Person>(
				SupportedRecordType.Person,
				'someId'
			);

			expect(person).toStrictEqual(expectedPerson);
		});

		it('should resolve with an object of type T if one could be found', async () => {
			const expectedPersonDomainPart: PersonDomainPart = {
				id: 'someId',
				recordType: 'personDomainPart',
			};

			mockConvertToObjectWithRecordType.mockReturnValueOnce(
				expectedPersonDomainPart
			);

			expect.assertions(1);

			const returned: PersonDomainPart = await getRecordById<PersonDomainPart>(
				SupportedRecordType.PersonDomainPart,
				'someId'
			);

			expect(returned).toStrictEqual(expectedPersonDomainPart);
		});
	});
});
