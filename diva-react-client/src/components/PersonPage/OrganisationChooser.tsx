import {
	Organisation,
	searchOrganisationsByDomain,
} from 'diva-cora-ts-api-wrapper';
import { DropButton, Select } from 'grommet';
import { Search } from 'grommet-icons';
import React, { useEffect, useState } from 'react';
import { LOGIN_STATUS, useAuth } from '../../context/AuthContext';
import useApi from '../../hooks/useApi';
import { escapeSearchString } from '../Login/LoginDomainChooser/helpers';

const OrganisationChooser = function () {
	const { auth } = useAuth();
	const { isLoading, result, setApiParams } = useApi(
		searchOrganisationsByDomain,
		{}
	);

	useEffect(() => {
		if (auth.status === LOGIN_STATUS.LOGGED_IN) {
			setApiParams({ domain: auth.domain });
		}
	}, []);

	const [options, setOptions] = useState<Organisation[]>([]);

	const [value, setValue] = useState<Organisation | undefined>(undefined);

	const handleChange = ({ value: newValue }: { value: Organisation }) => {
		setValue(newValue);
	};

	const handleSearch = (text: string) => {
		const filteredOptions = filterOrganisations(options, text);
		setOptions(filteredOptions);
	};

	const filterOrganisations = (units: Organisation[], searchTerm: string) => {
		const escapedSearchTerm = escapeSearchString(searchTerm);
		const exp = new RegExp(escapedSearchTerm, 'i');
		return units.filter((o) => exp.test(o.name));
	};

	useEffect(() => {
		if (result.hasData && result.data) {
			const newOptions = result.data.data as Organisation[];
			setOptions(newOptions);
		}
	}, [result]);

	return (
		<>
			{isLoading && 'Loading'}
			{result && (
				<Select
					options={options}
					size="medium"
					placeholder="Välj organisation"
					value={value}
					labelKey="name"
					valueKey={{ key: 'name' }}
					onChange={handleChange}
					onSearch={handleSearch}
				/>
			)}
		</>
	);
};

export default OrganisationChooser;
