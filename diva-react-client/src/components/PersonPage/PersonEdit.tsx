import React, { useState } from 'react';
import { Box, Button, Form, FormField, Grid } from 'grommet';
import { Add, FormSearch, Trash } from 'grommet-icons';
import { Name, Person } from 'diva-cora-ts-api-wrapper';
import PersonView from './PersonView';
import useForm from './useForm';

const PersonEdit = function ({ originalPerson }: { originalPerson: Person }) {
	const originalPersonWithEmptyDefaults = {
		yearOfBirth: '',
		yearOfDeath: '',
		viafIDs: [],
		...originalPerson,
	};
	// const [inputs, setInputs] = useState<Person>(originalPersonWithEmptyDefaults);

	const {
		inputs: person,
		handleChange,
		setInputs,
	} = useForm<Person>(originalPersonWithEmptyDefaults);

	console.log(person);

	const removeAlternativeName = (index: number) => {
		if (person.alternativeNames && person.alternativeNames.length > 0) {
			setInputs({
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
		setInputs({
			...person,
			alternativeNames: newAlternativeNames,
		});
	};

	const removeVIAF = (index: number) => {
		if (person.viafIDs && person.viafIDs.length > 0) {
			setInputs({
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
		setInputs({
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
									value={alternativeName.familyName}
									onChange={handleChange}
									required
								/>
								<FormField
									label="Förnamn"
									name={`alternativeNames[${index}].givenName`}
									value={alternativeName.givenName}
									onChange={handleChange}
									required
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
			VIAFGroup = person.viafIDs.map((viaf, index) => {
				return (
					<Box key={index} direction="row" justify="between" align="center">
						<FormField
							label="VIAF"
							name={`viafIDs[${index}]`}
							required
							value={viaf}
							onChange={handleChange}
						/>
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

	// const handleFormChange = (newFormState: Person) => {
	// 	console.log(newFormState);
	// 	setInputs(newFormState);
	// };

	return (
		<Grid columns={['1fr', '1fr']} gap={{ column: 'large' }}>
			<Form>
				<Box direction="row" justify="between" align="center">
					<FormField
						label="Efternamn"
						name="authorisedName.familyName"
						value={person.authorisedName?.familyName}
						onChange={handleChange}
						icon={<FormSearch />}
					/>
					<FormField
						label="Förnamn"
						name="authorisedName.givenName"
						value={person.authorisedName?.givenName}
						onChange={handleChange}
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
	// return (
	// 	<Grid columns={['1fr', '1fr']} gap={{ column: 'large' }}>
	// 		<Form>
	// 			<Box direction="row" justify="between" align="center">
	// 				<FormField
	// 					label="Efternamn"
	// 					name="authorisedName.familyName"
	// 					value={person.authorisedName?.familyName}
	// 					// onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
	// 					// 	const authorisedName = {
	// 					// 		givenName: '',
	// 					// 		...person.authorisedName,
	// 					// 		familyName: event.target.value,
	// 					// 	};

	// 					// 	setPerson({ ...person, authorisedName });
	// 					// }}
	// 					onChange={handleChange}
	// 				/>
	// 				{/* <FormField
	// 					label="Förnamn"
	// 					value={person.authorisedName?.givenName}
	// 					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
	// 						const authorisedName = {
	// 							familyName: '',
	// 							...person.authorisedName,
	// 							givenName: event.target.value,
	// 						};

	// 						setInputs({ ...person, authorisedName });
	// 					}}
	// 				/> */}
	// 			</Box>
	// 			{/* {AlternativeNameGroup}
	// 			<Button
	// 				icon={<Add />}
	// 				label="Lägg till alternativt namn"
	// 				plain
	// 				hoverIndicator
	// 				onClick={addAlternativeName}
	// 			/>
	// 			<FormField
	// 				name="academicTitle"
	// 				htmlFor="text-input-id"
	// 				label="Akademisk titel"
	// 			/>
	// 			<Box direction="row" justify="between" align="center">
	// 				<FormField label="Födelseår" name="yearOfBirth" />
	// 				<FormField label="Dödsår" name="yearOfDeath" />
	// 			</Box>
	// 			{VIAFGroup}
	// 			<Button
	// 				icon={<Add />}
	// 				label="Lägg till VIAF"
	// 				plain
	// 				hoverIndicator
	// 				onClick={addVIAF}
	// 			/> */}
	// 		</Form>
	// 		<PersonView person={person} />
	// 	</Grid>
	// );
};

export default PersonEdit;
