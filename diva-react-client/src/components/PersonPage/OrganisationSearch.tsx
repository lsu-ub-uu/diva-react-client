import { searchOrganisationsByDomainAndSearchTerm } from 'diva-cora-ts-api-wrapper';
import { Button, Grid, TextInput } from 'grommet';
import { Search, Select } from 'grommet-icons';
import React from 'react';
import useApi from '../../hooks/useApi';

const OrganisationSearch = function ({
	value,
	onValueChange,
	onSubmit,
}: {
	value: string;
	onValueChange: (newValue: string) => void;
	onSubmit: () => void;
}) {
	useApi(searchOrganisationsByDomainAndSearchTerm, {});

	return (
		<StyledForm onSubmit={handleSubmit}>
			<TextInput
				type="search"
				icon={<Search />}
				reverse
				placeholder="Sök med namn, ORCID eller id"
				value={value}
				onChange={handleChange}
				aria-labelledby="searchButton"
			/>
			<Button type="submit" id="searchButton" primary label="Sök" />
			<Grid
				columns={['6.3em', 'max-content']}
				gap={{ column: 'small' }}
				align="center"
			>
				<Select
					id="rows-input"
					aria-labelledby="rows-label"
					value={opinionatedRows.toString()}
					onChange={handleRowChange}
					options={options}
				/>
				<span id="rows-label">Träffar per sida</span>
			</Grid>
		</StyledForm>
	);
};

export default OrganisationSearch;
