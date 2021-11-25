import React from 'react';
import PersonList from './components/PersonList';
import PersonSearch from './components/PersonSearch';
import Person from './control/Person';

const persons: Person[] = [
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
		domains: ['Uppsala Universitet'],
	},
	{
		id: '3',
		authorisedName: {
			familyName: 'Ernman',
			givenName: 'Malena',
		},
	},
];

function App() {
	// return <PersonList persons={persons} />;
	return <PersonSearch />;
}

export default App;
