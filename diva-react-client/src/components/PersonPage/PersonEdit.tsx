import React, { useState } from 'react';
import { Box, Button, Form, FormField, Grid } from 'grommet';
import { Add, Trash } from 'grommet-icons';
import { Name, Person } from 'diva-cora-ts-api-wrapper';
import PersonView from './PersonView';

const PersonEdit = function ({ originalPerson }: { originalPerson: Person }) {
	const originalPersonWithEmptyDefaults = {
		yearOfBirth: '',
		yearOfDeath: '',
		viafIDs: [],
		...originalPerson,
	};
	const [person, setPerson] = useState<Person>(originalPersonWithEmptyDefaults);

	console.log(person);

	const removeAlternativeName = (index: number) => {
		if (person.alternativeNames && person.alternativeNames.length > 0) {
			setPerson({
				...person,
				alternativeNames: person.alternativeNames.filter(
					(v, _idx) => _idx !== index
				),
			});
		}
	};
	const addAlternativeName = () => {
		const newAlternativeNames: Name[] = [];
		if (person.alternativeNames && person.alternativeNames.length > 0) {
			newAlternativeNames.push(...person.alternativeNames);
		}

		newAlternativeNames.push({ givenName: '', familyName: '' });
		setPerson({
			...person,
			alternativeNames: newAlternativeNames,
		});
	};

	const removeVIAF = (index: number) => {
		if (person.viafIDs && person.viafIDs.length > 0) {
			setPerson({
				...person,
				viafIDs: person.viafIDs.filter((v, _idx) => _idx !== index),
			});
		}
	};
	const addVIAF = () => {
		const newVIAFs: string[] = [];
		if (person.viafIDs && person.viafIDs.length > 0) {
			newVIAFs.push(...person.viafIDs);
		}
		newVIAFs.push('');
		setPerson({
			...person,
			viafIDs: newVIAFs,
		});
	};

	let AlternativeNameGroup = null;
	const updateAlternativeNameGroup = () => {
		if (person.alternativeNames !== undefined) {
			AlternativeNameGroup = person.alternativeNames.map(
				(alternativeName, index) => {
					return (
						<Box>
							<Box
								key={index}
								direction="row-responsive"
								justify="between"
								align="center"
							>
								<FormField
									label="Efternamn"
									name={`alternativeNames[${index}].familyName`}
									required
								/>
								<FormField
									label="Förnamn"
									name={`alternativeNames[${index}].givenName`}
								/>
							</Box>
							<Box align="end" justify="center">
								<Button
									icon={<Trash />}
									label="Ta bort"
									plain
									hoverIndicator
									onClick={() => removeAlternativeName(index)}
								/>
							</Box>
						</Box>
					);
				}
			);
		}
	};
	updateAlternativeNameGroup();

	let VIAFGroup = null;
	const updateORCIDGroup = () => {
		if (person.viafIDs !== undefined) {
			VIAFGroup = person.viafIDs.map((alternativeName, index) => {
				return (
					<Box key={index} direction="row" justify="between" align="center">
						<FormField label="VIAF" name={`viafIDs[${index}]`} required />
						<Box>
							<Button
								icon={<Trash />}
								label="Ta bort"
								plain
								hoverIndicator
								onClick={() => removeVIAF(index)}
							/>
						</Box>
					</Box>
				);
			});
		}
	};
	updateORCIDGroup();

	// React.useEffect(() => {
	// 	// updateAlternativeNameGroup();
	// }, [person.alternativeNames]);

	const handleFormChange = (newFormState: Person) => {
		console.log(newFormState);
		setPerson(newFormState);
	};

	return (
		<Grid columns={['1fr', '1fr']} gap={{ column: 'large' }}>
			<Form value={person} onChange={handleFormChange}>
				<Box direction="row" justify="between" align="center">
					<FormField
						label="Efternamn"
						value={person.authorisedName?.familyName}
						onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
							const authorisedName = {
								givenName: '',
								...person.authorisedName,
								familyName: event.target.value,
							};

							setPerson({ ...person, authorisedName });
						}}
					/>
					<FormField
						label="Förnamn"
						value={person.authorisedName?.givenName}
						onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
							const authorisedName = {
								familyName: '',
								...person.authorisedName,
								givenName: event.target.value,
							};

							setPerson({ ...person, authorisedName });
						}}
					/>
				</Box>
				{AlternativeNameGroup}
				<Button
					icon={<Add />}
					label="Lägg till alternativt namn"
					plain
					hoverIndicator
					onClick={addAlternativeName}
				/>
				<FormField
					name="academicTitle"
					htmlFor="text-input-id"
					label="Akademisk titel"
				/>
				<Box direction="row" justify="between" align="center">
					<FormField label="Födelseår" name="yearOfBirth" />
					<FormField label="Dödsår" name="yearOfDeath" />
				</Box>
				{VIAFGroup}
				<Button
					icon={<Add />}
					label="Lägg till VIAF"
					plain
					hoverIndicator
					onClick={addVIAF}
				/>
			</Form>
			<PersonView person={person} />
		</Grid>
	);
};

export default PersonEdit;
