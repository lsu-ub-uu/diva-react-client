import convertToObject from '../converter/Converter';
import { RecordWrapper } from '../cora-data/CoraData';
import { personMatcher } from '../converter/definitions/PersonDefinitions';
import httpClient from './http/HttpClient';
import { IHttpClientRequestParameters } from './http/IHttpClient';
import { Person } from '../types/Person';

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

export { default as searchPersonsByNameSearch } from './api/searchPersonByNameSearch';
