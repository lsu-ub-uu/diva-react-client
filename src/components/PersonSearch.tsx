import React, { useState } from 'react';
import { getPersons } from '../control/api';
import Person from '../control/Person';
import PersonList from './PersonList';

export const PersonSearch = () => {
	const [persons, setPersons] = useState<Person[]>([]);

	const handleSend = () => {
		const personsFromAPI = getPersons();
		setPersons(personsFromAPI);
	};

	return (
		<div>
			<h1>Person search</h1>
			<input />
			<button onClick={handleSend} type="submit">
				Search
			</button>
			<PersonList persons={persons} />
		</div>
	);
};

export default PersonSearch;
