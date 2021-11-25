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
		.then((json) => {
			const personArray: Object[] = json.dataList.data;
			if (personArray.length === 0) {
				return [];
			}
			return [
				{
					authorisedName: {
						familyName: 'Bar',
						givenName: 'Foo',
					},
					id: '2',
				},
			];
		});
	// console.log(searchTerm);
	// return fetch('asdf')
	// 	.then((result) => {
	// 		console.log(result);
	// 		return result.json();
	// 	})
	// 	.then((data) => {
	// 		console.log(data.dataList);
	// 		return DUMMY_PERSONS;
	// 	});
	// return new Promise((resolve, reject) => {
	// 	resolve(DUMMY_PERSONS);
	// });

	// return Promise.resolve([]);
}

export default { getOrganisation, getPersons };
