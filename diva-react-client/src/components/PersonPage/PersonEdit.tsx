import React, { useState } from 'react';
import { Box, Button, Form, FormField, Grid, Text, TextArea } from 'grommet';
import { Add, Trash } from 'grommet-icons';
import {
	ExternalUrl,
	Name,
	Organisation,
	OtherAffiliation,
	Person,
	PersonDomainPart,
	RecordType,
} from 'diva-cora-ts-api-wrapper';
import PersonView from './PersonView';
import useForm from './useForm';
import PersonDomainPartEdit from './PersonDomainPartEdit';
import PersonDomainPartWrapper from './PersonDomainPartWrapper';
import RecordFetcher from '../RecordFetcher';

export interface FormPerson {
	domains: string[];

	authorisedName: Name;

	academicTitle: string;

	yearOfBirth: string;

	yearOfDeath: string;

	emailAddress: string;

	alternativeNames: Name[];

	externalURLs: ExternalUrl[];

	otherAffiliation: OtherAffiliation;

	orcids: string[];

	viafIDs: string[];

	librisIDs: string[];

	biographyEnglish: string;

	biographySwedish: string;

	personDomainParts: string[];
}

const returnStringIfUndefined = (field: string | undefined) => {
	return field || '';
};

const returnEmptyArrayIfUndefined = function <T>(field: T[] | undefined) {
	return field || [];
};

const convertToFormPerson = (person: Person): FormPerson => {
	const personDomainParts: string[] = [];
	if (person.personDomainParts) {
		person.personDomainParts.forEach((pdp) => {
			personDomainParts.push(pdp.recordId);
		});
	}
	return {
		domains: returnEmptyArrayIfUndefined<string>(person.domains),
		academicTitle: returnStringIfUndefined(person.academicTitle),
		alternativeNames: returnEmptyArrayIfUndefined<Name>(
			person.alternativeNames
		),
		authorisedName: person.authorisedName
			? person.authorisedName
			: { familyName: '', givenName: '' },
		biographyEnglish: returnStringIfUndefined(person.biographyEnglish),
		biographySwedish: returnStringIfUndefined(person.biographySwedish),
		emailAddress: returnStringIfUndefined(person.emailAddress),
		externalURLs: returnEmptyArrayIfUndefined<ExternalUrl>(person.externalURLs),
		librisIDs: returnEmptyArrayIfUndefined<string>(person.librisIDs),
		orcids: returnEmptyArrayIfUndefined<string>(person.orcids),
		viafIDs: returnEmptyArrayIfUndefined<string>(person.viafIDs),
		otherAffiliation: person.otherAffiliation
			? person.otherAffiliation
			: { name: '', fromYear: '', untilYear: '' },
		personDomainParts,
		yearOfBirth: returnStringIfUndefined(person.yearOfBirth),
		yearOfDeath: returnStringIfUndefined(person.yearOfDeath),
	};
};

type FormAffiliation = {
	id: string;
	fromYear: string;
	untilYear: string;
};

interface FormPersonDomainPart {
	id: string;
	identifiers: string[];
	domain: string;
	affiliations: { [key: string]: FormAffiliation };
}

const convertToFormPersonDomainPart = (
	personDomainPart: PersonDomainPart
): FormPersonDomainPart => {
	const affiliations: { [key: string]: FormAffiliation } = {};

	personDomainPart.affiliations.forEach((affiliation) => {
		affiliations[affiliation.id] = {
			fromYear: '',
			untilYear: '',
			...affiliation,
		};
	});

	return {
		id: personDomainPart.id,
		domain: personDomainPart.domain,
		affiliations,
		identifiers: personDomainPart.identifiers || [],
	};
};

const PersonEdit = function ({ originalPerson }: { originalPerson: Person }) {
	console.log(originalPerson);
	// const originalFormPersonWithEmptyDefaults: FormPerson = {
	// 	yearOfBirth: '',
	// 	yearOfDeath: '',
	// 	viafIDs: [],
	// 	domains: [],
	// 	...originalPerson,
	// };
	const originalFormPersonWithEmptyDefaults: FormPerson =
		convertToFormPerson(originalPerson);

	const initialPersonDomainParts: {
		[key: string]: FormPersonDomainPart;
	} = {};

	originalPerson.connectedDomains.forEach((domain) => {
		initialPersonDomainParts[domain.id] = convertToFormPersonDomainPart(domain);
	});

	const [personDomainParts, setPersonDomainParts] = useState(
		initialPersonDomainParts
	);

	// const initialAffiliations: any = {};
	// originalPerson.connectedDomains.forEach((domain) => {
	// 	domain.affiliations.forEach((affiliation) => {
	// 		if (affiliation.organisation) {
	// 			initialAffiliations[affiliation.id] = affiliation;
	// 		}
	// 	});
	// });

	// const [affiliations, setAffiliations] = useState(initialAffiliations);

	console.log(initialPersonDomainParts);
	// console.log(affiliations);

	const [person, setPerson] = useState<FormPerson>(
		originalFormPersonWithEmptyDefaults
	);

	const handleFormChange = (newFormState: FormPerson) => {
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
							label=""
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

					{person.personDomainParts &&
						person.personDomainParts.length > 0 &&
						person.personDomainParts.map((pdpId) => {
							const personDomainPart = personDomainParts[pdpId];
							return (
								<Box>
									<Text>{personDomainPart.domain}</Text>
									{Object.values(personDomainPart.affiliations).map(
										(affiliation) => {
											// const affiliation = affiliations[affiliation.id];
											return (
												<Box direction="row" justify="between" align="center">
													{/* <Text>{affiliation.name}</Text> */}
													<FormField
														label="Från"
														value={affiliation.fromYear}
														onChange={(
															event: React.ChangeEvent<HTMLInputElement>
														) => {
															setPersonDomainParts({
																...personDomainParts,
																[personDomainPart.id]: {
																	...personDomainPart,
																	affiliations: {
																		...personDomainPart.affiliations,
																		[affiliation.id]: {
																			...affiliation,
																			fromYear: event.target.value,
																		},
																	},
																},
															});
														}}
													/>
													<FormField
														name={`${affiliation.id}-until`}
														label="Till"
														value={affiliation.untilYear}
														onChange={(
															event: React.ChangeEvent<HTMLInputElement>
														) => {
															setPersonDomainParts({
																...personDomainParts,
																[personDomainPart.id]: {
																	...personDomainPart,
																	affiliations: {
																		...personDomainPart.affiliations,
																		[affiliation.id]: {
																			...affiliation,
																			untilYear: event.target.value,
																		},
																	},
																},
															});
														}}
													/>
												</Box>
											);
										}
									)}
								</Box>
							);
						})}

					<Box direction="row" justify="between" margin={{ top: 'medium' }}>
						<Button type="submit" label="Submit" primary />
					</Box>
				</Form>
			</Box>
			<Box>
				{/* <pre>{JSON.stringify(affiliations, null, 2)}</pre> */}
				<pre>{JSON.stringify(personDomainParts, null, 2)}</pre>
				<pre>{JSON.stringify(person, null, 2)}</pre>
			</Box>
			{/* <PersonView person={person} /> */}
		</Grid>
	);
};

export default PersonEdit;
