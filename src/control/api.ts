import convertToObject from '../converter/Converter';
import { RecordWrapper } from '../converter/CoraData';
import {
	personMatcher,
	PersonObject,
} from '../converter/Person/PersonDefinitions';
import httpClient from './HttpClient';
import { IHttpClientRequestParameters } from './IHttpClient';

export function getPersonById(id: string): Promise<PersonObject> {
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
					const person = convertToObject<PersonObject>(
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

export { default as searchPersonsByNameSearch } from './api/searchPersonByNameSearch';
