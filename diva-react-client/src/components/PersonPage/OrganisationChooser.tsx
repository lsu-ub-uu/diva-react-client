import {
	List,
	Organisation,
	searchOrganisationsByDomain,
} from 'diva-cora-ts-api-wrapper';
import { Box, DropButton, Select } from 'grommet';
import { Add } from 'grommet-icons';
import React, { useEffect, useState } from 'react';
import { LOGIN_STATUS, useAuth } from '../../context/AuthContext';
import useApi from '../../hooks/useApi';
import { escapeSearchString } from '../Login/LoginDomainChooser/helpers';

export const OrganisationChooser = function ({
	onChange,
}: {
	onChange: (organisation: Organisation) => void;
}) {
	const { auth } = useAuth();
	const { isLoading, result, setApiParams } = useApi<List>(
		searchOrganisationsByDomain,
		{}
	);

	useEffect(() => {
		if (auth.status === LOGIN_STATUS.LOGGED_IN) {
			setApiParams({ domain: auth.domain });
		}
	}, []);

	const [allOptions, setAllOptions] = useState<Organisation[]>([]);
	const [currentOptions, setCurrentOptions] = useState<Organisation[]>([]);

	const [value, setValue] = useState<Organisation | undefined>(undefined);

	const handleChange = ({ value: newValue }: { value: Organisation }) => {
		setValue(newValue);
		onChange(newValue);
	};

	const handleSearch = (text: string) => {
		const filteredOptions = filterOrganisations(allOptions, text);
		setCurrentOptions(filteredOptions);
	};

	const filterOrganisations = (units: Organisation[], searchTerm: string) => {
		const escapedSearchTerm = escapeSearchString(searchTerm);
		const exp = new RegExp(escapedSearchTerm, 'i');
		return units.filter((o) => exp.test(o.name));
	};

	useEffect(() => {
		if (result.hasData && result.data) {
			const newOptions = result.data.data as Organisation[];
			setAllOptions(newOptions);
			setCurrentOptions(newOptions);
		}
	}, [result]);

	return (
		<>
			{isLoading && 'Laddar organisationer'}
			{result.hasData && (
				<Select
					options={currentOptions}
					onClose={() => {
						setCurrentOptions(allOptions);
					}}
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

export const OrganisationChooserDropButton = function ({
	onOrganisationChange,
}: {
	onOrganisationChange: (organisation: Organisation) => void;
}) {
	const [open, setOpen] = React.useState<boolean>(false);

	const onOpen = () => {
		setOpen(true);
	};

	const onClose = () => {
		setOpen(false);
	};

	const onChange = (organistion: Organisation) => {
		onOrganisationChange(organistion);
		onClose();
	};

	return (
		<Box align="center" pad="small">
			<DropButton
				icon={<Add />}
				label="Lägg till Affiliering"
				open={open}
				onOpen={onOpen}
				onClose={onClose}
				dropContent={<OrganisationChooser onChange={onChange} />}
				dropProps={{ align: { top: 'bottom' } }}
			/>
		</Box>
	);
};
