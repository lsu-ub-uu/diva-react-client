import { RecordWrapper } from '../converter/CoraData';
import convertPersonDataGroupToPerson from '../converter/Person/PersonConverter';
import httpClient from './HttpClient';
import { IHttpClientRequestParameters } from './IHttpClient';
import Person from './Person';

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
					const person = convertPersonDataGroupToPerson(
						recordWrapper.record.data
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
