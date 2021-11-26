import React, { useState } from 'react';
import { searchPersonsByNameSearch } from '../control/api';
import Person from '../control/Person';
import PersonList from './PersonList';

export const PersonSearch = function () {
	const [persons, setPersons] = useState<Person[]>([]);
	const [searchTerm, setSearchTerm] = useState<string>('');

	const handleSend = () => {
		const promiseFromSearch = searchPersonsByNameSearch(searchTerm);
		promiseFromSearch.then((personsFromAPI) => {
			setPersons(personsFromAPI);
		});
	};

	const handleSearchTerm = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
	};

	return (
		<div>
			<h1>Person search</h1>
			<input value={searchTerm} onChange={handleSearchTerm} />
			<button onClick={handleSend} type="submit">
				Search
			</button>
			<PersonList persons={persons} />
		</div>
	);
};

export default PersonSearch;
