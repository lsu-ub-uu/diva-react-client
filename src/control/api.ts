import convertPerson from '../converter/Converter';
import { DataGroup, RecordWrapper } from '../converter/CoraData';
import Person from './Person';

const DUMMY_PERSONS: Person[] = [
	{
		id: '1',
		authorisedName: {
			familyName: 'Anka',
			givenName: 'Kalle',
		},
	},
	{
		id: '2',
		authorisedName: {
			familyName: 'Enequist',
			givenName: 'Gerd',
		},
		domains: ['Uppsala Universitet', 'Test'],
	},
	{
		id: '3',
		authorisedName: {
			familyName: 'Ernman',
			givenName: 'Malena',
		},
	},
];

function getOrganisation() {
	return 'SomeOtherOrg';
}

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

export default { getOrganisation, getPersons };
