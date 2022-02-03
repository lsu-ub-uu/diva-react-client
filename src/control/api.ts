import { RecordWrapper } from '../converter/CoraData';
import GenericConverter from '../converter/GenericConverter';
import {
	personMultipleDefinition,
	PersonObject,
} from '../converter/Person/PersonDefinitions';
import httpClient from './HttpClient';
import { IHttpClientRequestParameters } from './IHttpClient';
import Person, { fromPersonObject } from './Person';

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
					const converter = new GenericConverter(personMultipleDefinition);
					const personObject = converter.convertToGenericObject<PersonObject>(
						recordWrapper.record.data
					);

					const person = fromPersonObject(personObject);

					// const person = convertPerson(recordWrapper.record.data);
					resolve(person);
				})
				.catch((error: unknown) => {
					reject(error);
				});
		}
	});
}

export { default as searchPersonsByNameSearch } from './api/searchPersonByNameSearch';
