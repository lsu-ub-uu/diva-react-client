import convertPerson from '../converter/Converter';
import { RecordWrapper } from '../converter/CoraData';
import httpClient from './HttpClient';
import { IHttpClientRequestParameters } from './IHttpClient';
import Person from './Person';

const DUMMY_PERSONS: Person[] = [
	new Person('1', {
		familyName: 'Anka',
		givenName: 'Kalle',
	}),
	new Person('2', {
		familyName: 'Enequist',
		givenName: 'Gerd',
	}),
	new Person('3', {
		familyName: 'Ernman',
		givenName: 'Malena',
	}),
];

export function getPersons(): Person[] {
	return DUMMY_PERSONS;
}

export function searchPersonsByNameSearch(
	searchTerm: string
): Promise<Person[]> {
	const searchEndpoint = 'record/searchResult/';
	const nameSearch = `publicPersonSearch?searchData={"name":"search","children":[{"name":"include","children":[{"name":"includePart","children":[{"name":"personNameSearchTerm","value":"${searchTerm}"}]}]}]}`;
	const fetchURL = process.env.BASE_URL + searchEndpoint + nameSearch;
	return fetch(fetchURL)
		.then((result) => {
			return result.json();
		})
		.then((dataListWrapper) => {
			const personArray: RecordWrapper[] = dataListWrapper.dataList.data;
			return personArray.map((recordWrapper) => {
				return convertPerson(recordWrapper.record.data);
			});
		});
}

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
					const person = convertPerson(recordWrapper.record.data);
					resolve(person);
				})
				.catch((error: unknown) => {
					reject(error);
				});
		}
	});
}

export default { getPersons };
