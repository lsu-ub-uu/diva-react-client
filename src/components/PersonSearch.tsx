import React, { useState } from 'react';
import styled from 'styled-components';
import { searchPersonsByNameSearch } from '../control/api';
import Person from '../control/Person';
import Button from '../styles/Button';
import InputText from '../styles/InputText';
import ListComponent from './ListComponent';

const Parent = styled.div`
	display: grid;
	grid-template-rows: auto 1fr auto;
`;

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
		<Parent>
			<h1>Personsök</h1>
			<form key="form" onSubmit={handleSubmit}>
				<InputText
					key="searchTerm"
					value={searchTerm}
					onChange={handleSearchTerm}
				/>
				<Button type="submit" primary>
					Sök
				</Button>
			</form>
			<ListComponent list={persons} />
		</Parent>
	);
};

export default PersonSearch;
