import React, { useState } from 'react';
import { Outlet } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { searchPersonsByNameSearch } from '../control/api';
import List from '../control/List';
import Button from '../styles/Button';
import SearchTextField from '../styles/SearchTextField';
import CardList from './CardList';
import PaginationComponent from './PaginationComponent';

const Parent = styled.div`
	display: grid;
	grid-template-rows: auto 1fr auto;
`;

export const PersonSearch = function () {
	const [searchParams, setSearchParams] = useSearchParams();
	const searchTerm = searchParams.get('searchTerm') || '';

	const [list, setList] = useState<List>();

	React.useEffect(() => {
		possiblyExecuteSearch();
	}, []);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		possiblyExecuteSearch();
	};

	const possiblyExecuteSearch = () => {
		if (searchTerm !== '') {
			getPaginationVarsAndQuerySearch();
		}
	};

	const getPaginationVarsAndQuerySearch = () => {
		const { start, rows } = getPaginationVars();

		const promiseFromSearch = searchPersonsByNameSearch(
			searchTerm,
			start,
			rows
		);

		promiseFromSearch.then((personListFromSearch) => {
			setList(personListFromSearch);
		});
	};

	const getPaginationVars = (): { start: number; rows: number } => {
		const start = getStartValue();
		const rows = getRowsValue();

		return { start, rows };
	};

	const getStartValue = () => {
		const startValue = searchParams.get('start') || '1';
		return getPositiveNumberOrDefault(startValue, 1);
	};

	const getRowsValue = () => {
		const rowsValue = searchParams.get('rows') || '100';
		return getPositiveNumberOrDefault(rowsValue, 100);
	};

	const getPositiveNumberOrDefault = (input: string, defaultNumber: number) => {
		const parsedNumber = parseInt(input, 10);
		if (Number.isNaN(parsedNumber) || parsedNumber < 1) {
			return defaultNumber;
		}

		return parsedNumber;
	};

	const handleSearchTerm = (event: React.ChangeEvent<HTMLInputElement>) => {
		const searchTermFromInput = event.target.value;

		if (searchTermFromInput) {
			setSearchParams({ searchTerm: searchTermFromInput });
		} else {
			setSearchParams({});
		}
	};

	const onPaginationUpdate = (start: number, rows: number) => {
		searchParams.set('start', start.toString());
		searchParams.set('rows', rows.toString());
		setSearchParams(searchParams);
		possiblyExecuteSearch();
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
				{list && (
					<PaginationComponent
						start={getStartValue()}
						rows={getRowsValue()}
						totalNumber={list.totalNumber}
						onPaginationUpdate={onPaginationUpdate}
					/>
				)}
				{list && <CardList list={list.data} />}
			</main>
		</Parent>
	);
};

export default PersonSearch;
