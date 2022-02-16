import convertToObject from '../converter/Converter';
import { RecordWrapper } from '../cora-data/CoraData';
import { personMatcher } from '../converter/definitions/PersonDefinitions';
import httpClient from './http/HttpClient';
import { IHttpClientRequestParameters } from './http/IHttpClient';
import { Person } from '../types/Person';
import SupportedRecordType from '../types/RecordTypes';
import convertToObjectWithRecordType from '../converter/RecordTypeConverter';

export function getPersonById(id: string): Promise<Person> {
	return new Promise((resolve, reject) => {
		if (id === '') {
			reject(new Error('No id was passed to getPersonById.'));
		} else {
			const urlForPersonRecord = `${process.env.BASE_URL}record/person/${id}`;
			const parameters: IHttpClientRequestParameters = {
				url: urlForPersonRecord,
			};
			httpClient
				.get<RecordWrapper>(parameters)
				.then((recordWrapper) => {
					const person = convertToObject<Person>(
						recordWrapper.record.data,
						personMatcher
					);
					resolve(person);
				})
				.catch((error: unknown) => {
					reject(error);
				});
		}
	});
}

export function getRecordById<T>(
	recordType: SupportedRecordType,
	id: string
): Promise<T> {
	return new Promise((resolve, reject) => {
		if (id === '') {
			reject(
				new Error(
					`getRecordById was called with recordType ${recordType} but no id.`
				)
			);
		} else {
			const urlForRecord = `${process.env.BASE_URL}record/${recordType}/${id}`;
			const parameters: IHttpClientRequestParameters = {
				url: urlForRecord,
			};
			httpClient
				.get<RecordWrapper>(parameters)
				.then((recordWrapper) => {
					// convertToObject<Person>(recordWrapper.record.data, personMatcher);
					const obj = convertToObjectWithRecordType<T>(
						recordWrapper.record.data,
						recordType
					);
					resolve(obj);
				})
				.catch((error: unknown) => {
					reject(error);
				});
		}
	});
}

export { default as searchPersonsByNameSearch } from './api/searchPersonByNameSearch';
