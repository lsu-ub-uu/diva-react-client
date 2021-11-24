import React from 'react';
import PersonList from './components/PersonList';
import PersonSearch from './components/PersonSearch';
import Person from './control/Person';

const persons: Person[] = [
	{
		id: '1',
		authorizedName: {
			familyName: 'Anka',
			givenName: 'Kalle',
		},
	},
	{
		id: '2',
		authorizedName: {
			familyName: 'Enequist',
			givenName: 'Gerd',
		},
		domains: ['Uppsala Universitet'],
	},
	{
		id: '3',
		authorizedName: {
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
