import React, { useState } from 'react';
import { Box, Button, Form, FormField, Grid, TextArea } from 'grommet';
import { Add, Trash } from 'grommet-icons';
import { ExternalUrl, Name, Person } from 'diva-cora-ts-api-wrapper';
import PersonView from './PersonView';
import useForm from './useForm';
import PersonDomainPartEdit from './PersonDomainPartEdit';
import PersonDomainPartWrapper from './PersonDomainPartWrapper';

const PersonEdit = function ({ originalPerson }: { originalPerson: Person }) {
	const originalPersonWithEmptyDefaults = {
		yearOfBirth: '',
		yearOfDeath: '',
		viafIDs: [],
		externalURLs: [],
		emailAddress: '',
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

	const removeExternalLink = (index: number) => {
		if (person.externalURLs && person.externalURLs.length > 0) {
			setInputs({
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
		setInputs({
			...person,
			externalURLs: newArray,
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
	const updateVIAFGroup = () => {
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
	updateVIAFGroup();

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
								value={externalURL.linkTitle}
								onChange={handleChange}
								required
							/>
							<FormField
								label="URL"
								name={`externalURLs[${index}].URL`}
								value={externalURL.URL}
								onChange={handleChange}
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
					value={person.academicTitle}
					onChange={handleChange}
					htmlFor="text-input-id"
					label="Akademisk titel"
				/>
				<Box direction="row" justify="between" align="center">
					<FormField
						label="Födelseår"
						name="yearOfBirth"
						value={person.yearOfBirth}
						onChange={handleChange}
						validate={(value: string) => {
							const regex = /^[0-9]{4}$/;
							if (value === '' || regex.test(value)) {
								return '';
							}
							return `Födelseår måste vara i format YYYY.`;
						}}
					/>
					<FormField
						label="Dödsår"
						name="yearOfDeath"
						value={person.yearOfDeath}
						onChange={handleChange}
						validate={(value: string) => {
							const regex = /^[0-9]{4}$/;
							if (value === '' || regex.test(value)) {
								return '';
							}
							return `Dödsår måste vara i format YYYY.`;
						}}
					/>
				</Box>
				{VIAFGroup}
				<Button
					icon={<Add />}
					label="Lägg till VIAF"
					plain
					hoverIndicator
					onClick={addVIAF}
				/>
				<FormField
					name="emailAddress"
					value={person.emailAddress}
					onChange={handleChange}
					label="E-post"
					validate={(value: string) => {
						console.log(value);
						const regex = /^[0-9A-Za-z:\-_.]{2,50}@[0-9A-Za-z:\-_.]{2,300}$/;
						if (value === '' || regex.test(value)) {
							return '';
						}
						return `Ange en giltig e-post.`;
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
				<FormField
					label="Biografi"
					htmlFor="biographySwedish"
					onChange={handleChange}
				>
					<TextArea
						id="biographySwedish"
						name="biographySwedish"
						value={person.biographySwedish}
					/>
				</FormField>
				<FormField
					label="Biography"
					htmlFor="biographyEnglish"
					onChange={handleChange}
				>
					<TextArea
						id="biographyEnglish"
						name="biographyEnglish"
						value={person.biographyEnglish}
					/>
				</FormField>

				{person.personDomainParts?.map((personDomainPart) => {
					return (
						<PersonDomainPartWrapper id={personDomainPart.recordId} edit />
					);
				})}

				<Box align="end">
					<Button type="submit" label="Spara" />
				</Box>
			</Form>
			<PersonView person={person} showAll />
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
