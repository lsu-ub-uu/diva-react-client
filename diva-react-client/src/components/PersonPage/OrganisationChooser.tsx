import { Organisation } from 'diva-cora-ts-api-wrapper';
import { Box, DropButton, Select } from 'grommet';
import { Add } from 'grommet-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { escapeSearchString } from '../Login/LoginDomainChooser/helpers';

export const OrganisationChooser = function ({
	onChange,
	organisations,
}: {
	onChange: (organisation: Organisation) => void;
	organisations: Organisation[];
}) {
	// const { auth } = useAuth();
	// const { isLoading, result, setApiParams } = useApi<List>(
	// 	searchOrganisationsByDomain,
	// 	{}
	// );

	// useEffect(() => {
	// 	if (auth.status === LOGIN_STATUS.LOGGED_IN) {
	// 		setApiParams({ domain: auth.domain });
	// 	}
	// }, []);

	useEffect(() => {
		// setAllOptions(organisations);
		setCurrentOptions(organisations);
	}, [organisations]);

	// const [allOptions, setAllOptions] = useState<Organisation[]>([]);
	const [currentOptions, setCurrentOptions] = useState<Organisation[]>([]);

	const [value, setValue] = useState<Organisation | undefined>(undefined);

	const handleChange = React.useCallback(
		({ value: newValue }: { value: Organisation }) => {
			setValue(newValue);
			onChange(newValue);
		},
		[value]
	);

	const handleSearch = React.useCallback(
		(text: string) => {
			const filteredOptions = filterOrganisations(organisations, text);
			setCurrentOptions(filteredOptions);
		},
		[organisations]
	);

	const filterOrganisations = (units: Organisation[], searchTerm: string) => {
		const escapedSearchTerm = escapeSearchString(searchTerm);
		const exp = new RegExp(escapedSearchTerm, 'i');
		return units.filter((o) => exp.test(o.name));
	};

	// useEffect(() => {
	// 	if (result.hasData && result.data) {
	// 		const newOptions = result.data.data as Organisation[];
	// 		setAllOptions(newOptions);
	// 		setCurrentOptions(newOptions);
	// 	}
	// }, [result]);

	return (
		<Select
			options={currentOptions}
			onClose={useCallback(() => {
				setCurrentOptions(organisations);
			}, [organisations])}
			size="medium"
			placeholder="Välj organisation"
			value={value}
			labelKey="name"
			valueKey={{ key: 'id' }}
			onChange={handleChange}
			onSearch={handleSearch}
		/>
	);
};

export const OrganisationChooserDropButton = function ({
	onOrganisationChange,
	organisations,
}: {
	onOrganisationChange: (organisation: Organisation) => void;
	organisations: Organisation[];
}) {
	const [open, setOpen] = React.useState<boolean>(false);

	const onOpen = useCallback(() => {
		setOpen(true);
	}, []);

	const onClose = useCallback(() => {
		setOpen(false);
	}, []);

	const onChange = useCallback((organisation: Organisation) => {
		onOrganisationChange(organisation);
		onClose();
	}, []);

	return (
		<Box align="center" pad="small">
			<DropButton
				icon={<Add />}
				label="Lägg till Affiliering"
				open={open}
				onOpen={onOpen}
				onClose={onClose}
				dropContent={
					<OrganisationChooser
						onChange={onChange}
						organisations={organisations}
					/>
				}
				dropProps={{ align: { top: 'bottom' } }}
			/>
		</Box>
	);
};
