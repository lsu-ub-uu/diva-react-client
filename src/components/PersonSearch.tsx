import React, { useState } from 'react';
import { Outlet } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { searchPersonsByNameSearch } from '../control/api';
import Person from '../control/Person';
import Button from '../styles/Button';
import InputText from '../styles/InputText';
import SearchTextField from '../styles/SearchTextField';
import ListComponent from './ListComponent';

const Parent = styled.div`
	display: grid;
	grid-template-rows: auto 1fr auto;
`;

export const PersonSearch = function () {
	const [searchParams, setSearchParams] = useSearchParams();
	const searchTerm = searchParams.get('searchTerm') || '';
	const [persons, setPersons] = useState<Person[]>([]);

	React.useEffect(() => {
		queryPersonSearch();
	}, []);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		queryPersonSearch();
	};

	const queryPersonSearch = () => {
		if (searchTerm !== '') {
			const promiseFromSearch = searchPersonsByNameSearch(searchTerm);
			promiseFromSearch.then((personsFromSearch) => {
				setPersons(personsFromSearch);
			});
		}
	};

	const handleSearchTerm = (event: React.ChangeEvent<HTMLInputElement>) => {
		const searchTermFromInput = event.target.value;

		if (searchTermFromInput) {
			setSearchParams({ searchTerm: searchTermFromInput });
		} else {
			setSearchParams({});
		}
	};

	return (
		<Parent>
			<main>
			<header>	
				<h1>Personsök</h1>
			</header>
			<form key="form" onSubmit={handleSubmit} role="search">
				<SearchTextField
					key="searchTerm"
					val={searchTerm}
					action={handleSearchTerm}
					labelledbyID="searchButton"
				/>
				<Button type="submit" id="searchButton" primary>
					Sök
				</Button>
			</form>
			<Outlet />
			<ListComponent list={persons} />
			</main>
		</Parent>
	);
};

export default PersonSearch;
