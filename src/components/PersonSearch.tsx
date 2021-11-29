import React, { useState } from 'react';
import { searchPersonsByNameSearch } from '../control/api';
import Person from '../control/Person';
import PersonList from './PersonList';

export const PersonSearch = function () {
	const [persons, setPersons] = useState<Person[]>([]);
	const [searchTerm, setSearchTerm] = useState<string>('');

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (searchTerm !== '') {
			const promiseFromSearch = searchPersonsByNameSearch(searchTerm);
			promiseFromSearch.then((personsFromSearch) => {
				setPersons(personsFromSearch);
			});
		}
	};

	const handleSearchTerm = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
	};

	return (
		<div>
			<h1>Person search</h1>
			<form onSubmit={handleSubmit}>
				<input value={searchTerm} onChange={handleSearchTerm} />
				<button type="submit">Search</button>
			</form>
			<PersonList persons={persons} />
		</div>
	);
};

export default PersonSearch;
