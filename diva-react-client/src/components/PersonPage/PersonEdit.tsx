import React, { useState } from 'react';
import { Box, Button, Form, FormField, Grid, Text, TextArea } from 'grommet';
import { Add, Trash } from 'grommet-icons';
import { ExternalUrl, Name, Person } from 'diva-cora-ts-api-wrapper';
import PersonView from './PersonView';
import useForm from './useForm';
import PersonDomainPartEdit from './PersonDomainPartEdit';
import PersonDomainPartWrapper from './PersonDomainPartWrapper';

const PersonEdit = function ({ originalPerson }: { originalPerson: Person }) {
	console.log(originalPerson);
	const originalPersonWithEmptyDefaults = {
		yearOfBirth: '',
		yearOfDeath: '',
		viafIDs: [],
		...originalPerson,
	};
	const [person, setPerson] = useState<Person>(originalPersonWithEmptyDefaults);

	const handleFormChange = (newFormState: Person) => {
		console.log({ newFormState });
		if (newFormState) {
			setPerson(newFormState);
		}
	};

	const addAlternativeName = () => {
		const newAlternativeName: Name = { familyName: '', givenName: '' };
		const newAlternativeNames: Name[] = [];
		if (person.alternativeNames && person.alternativeNames.length > 0) {
			newAlternativeNames.push(...person.alternativeNames);
		}
		newAlternativeNames.push(newAlternativeName);
		setPerson({
			...person,
			alternativeNames: newAlternativeNames,
		});
	};

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

	let AlternativeNameGroup = null;
	if (person.alternativeNames !== undefined) {
		AlternativeNameGroup = person.alternativeNames.map(
			(alternativeName, index) => (
				<Box
					key={index}
					direction="row"
					justify="between"
					align="center"
					border={{ size: 'small' }}
				>
					<Text>Alternativ namn</Text>
					<FormField
						label="Efternamn"
						name={`alternativeNames[${index}].familyName`}
						required
						// validate={[
						// 	{ regexp: /^[0-9]*$/ },
						// 	(number) => {
						// 		if (number && number.length > 10) return 'Only 10 numbers';
						// 		return undefined;
						// 	},
						// ]}
					/>
					<FormField
						label="Förnamn"
						name={`alternativeNames[${index}].givenName`}
						// validate={[
						// 	{ regexp: /^[0-9]*$/ },
						// 	(ext) => {
						// 		if (ext && ext.length > 3) return 'Only 3 numbers';
						// 		return undefined;
						// 	},
						// ]}
					/>
					<Box>
						<Button
							icon={<Trash />}
							label="Ta bort"
							plain
							hoverIndicator
							onClick={() => removeAlternativeName(index)}
						/>
					</Box>
				</Box>
			)
		);
	}

	const removeExternalLink = (index: number) => {
		if (person.externalURLs && person.externalURLs.length > 0) {
			setPerson({
				...person,
				externalURLs: person.externalURLs.filter((v, _idx) => _idx !== index),
			});
		}
	};
	const addExternalLink = () => {
		const newArray: ExternalUrl[] = [];
		if (person.externalURLs && person.externalURLs.length > 0) {
			newArray.push(...person.externalURLs);
		}

		newArray.push({ linkTitle: '', URL: '' });
		setPerson({
			...person,
			externalURLs: newArray,
		});
	};

	let ExternalLinkGroup = null;
	const updateExternalLinkGroup = () => {
		if (person.externalURLs !== undefined) {
			ExternalLinkGroup = person.externalURLs.map((externalURL, index) => {
				return (
					<Box>
						<Box
							key={index}
							direction="row-responsive"
							justify="between"
							align="center"
						>
							<FormField
								label="Länktext"
								name={`externalURLs[${index}].linkTitle`}
								required
							/>
							<FormField
								label="URL"
								name={`externalURLs[${index}].URL`}
								required
								validate={(value: string) => {
									const regex =
										/(?=^.{3,255}$)^(https?:\/\/(www\.)?)?[-a-zA-Z0-9@:%._\+~#=]{1,240}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
									if (value === '' || regex.test(value)) {
										return '';
									}
									return `Ange en giltig URL.`;
								}}
							/>
						</Box>
						<Box align="end" justify="center">
							<Button
								icon={<Trash />}
								label="Ta bort"
								plain
								hoverIndicator
								onClick={() => removeExternalLink(index)}
							/>
						</Box>
					</Box>
				);
			});
		}
	};
	updateExternalLinkGroup();

	return (
		<Grid columns={['1fr', '1fr']} gap={{ column: 'large' }}>
			<Box pad="medium" width="large">
				<Form
					value={person}
					validate="blur"
					// onReset={() => {
					// 	setValues({
					// 		name: '',
					// 		phones: [{ number: '', ext: '' }],
					// 	});
					// }}
					onChange={handleFormChange}
					onValidate={(validationResults) => {
						console.log('validationResults = ', validationResults);
					}}
					onSubmit={(event) => {
						console.log('Submit', event.value, event.touched);
					}}
				>
					<Box direction="row" justify="between" align="center">
						<FormField
							label="Efternamn"
							required
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
						label="Lägg till alternativ namne"
						plain
						hoverIndicator
						onClick={addAlternativeName}
					/>
					<FormField name="academicTitle" label="Akademisk titel" />
					<Box direction="row" justify="between" align="center">
						<FormField label="Födelseår" name="yearOfBirth" />
						<FormField label="Dödsår" name="yearOfDeath" />
					</Box>
					{person.viafIDs &&
						person.viafIDs.map((viaf, index) => {
							return (
								<Box direction="row" justify="between" align="center">
									<FormField
										name="viaf"
										label="VIAF"
										value={viaf}
										onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
											if (person.viafIDs && person.viafIDs.length > 0) {
												const newViafs = person.viafIDs;
												newViafs[index] = event.target.value;

												setPerson({ ...person, viafIDs: newViafs });
											}
										}}
									/>
									<Button
										icon={<Trash />}
										label="Ta bort"
										plain
										hoverIndicator
										onClick={() => {
											if (person.viafIDs && person.viafIDs.length > 0) {
												const newArray = person.viafIDs;

												newArray.splice(index, 1);

												setPerson({ ...person, viafIDs: newArray });
											}
										}}
									/>
								</Box>
							);
						})}
					<Button
						icon={<Add />}
						label="Lägg till VIAF"
						plain
						hoverIndicator
						onClick={() => {
							const newArray: string[] = [];
							if (person.viafIDs && person.viafIDs.length > 0) {
								newArray.push(...person.viafIDs);
							}
							newArray.push('');
							setPerson({ ...person, viafIDs: newArray });
						}}
					/>
					{ExternalLinkGroup}
					<Button
						icon={<Add />}
						label="Lägg till external URL"
						plain
						hoverIndicator
						onClick={addExternalLink}
					/>
					<Box direction="row" justify="between" margin={{ top: 'medium' }}>
						<Button type="submit" label="Submit" primary />
					</Box>
				</Form>
			</Box>
			<Box>
				<pre>{JSON.stringify(person, null, 2)}</pre>
			</Box>
		</Grid>
	);
};

export default PersonEdit;
