import React, { useState } from 'react';
import { searchPersonsByNameSearch } from '../control/api';
import Person from '../control/Person';
import PersonList from './PersonList';

export const PersonSearch = function () {
	const [persons, setPersons] = useState<Person[]>([]);
	const [searchTerm, setSearchTerm] = useState<string>('');

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const promiseFromSearch = searchPersonsByNameSearch(searchTerm);
		promiseFromSearch.then((personsFromSearch) => {
			setPersons(personsFromSearch);
		});
	};

	const handleSearchTerm = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
	};

	return (
		<form onSubmit={handleSubmit}>
			<h1>Person search</h1>
			<input value={searchTerm} onChange={handleSearchTerm} />
			<button type="submit">Search</button>
			<PersonList persons={persons} />
		</form>
	);
};

export default PersonSearch;
