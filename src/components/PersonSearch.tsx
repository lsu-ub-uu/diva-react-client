import React, { useState } from 'react';
import { Outlet } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { searchPersonsByNameSearch } from '../control/api';
import Listable from '../control/Listable';
import Button from '../styles/Button';
import SearchTextField from '../styles/SearchTextField';
import CardList from './CardList';

const Parent = styled.div`
	display: grid;
	grid-template-rows: auto 1fr auto;
`;

export const PersonSearch = function () {
	const [searchParams, setSearchParams] = useSearchParams();
	const searchTerm = searchParams.get('searchTerm') || '';
	const [persons, setPersons] = useState<Listable[]>([]);

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
			promiseFromSearch.then((personListFromSearch) => {
				setPersons(personListFromSearch.data);
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
				<CardList list={persons} />
			</main>
		</Parent>
	);
};

export default PersonSearch;
