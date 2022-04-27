import React, { useReducer, useState } from 'react';
import {
	Box,
	Button,
	Card,
	CardHeader,
	Heading,
	Form,
	FormField,
	Grid,
	Text,
} from 'grommet';
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

	type FormPersonDomainPartObject = {
		[key: string]: FormPersonDomainPart;
	};

	const initialPersonDomainParts: FormPersonDomainPartObject = {};

	originalPerson.connectedDomains.forEach((domain) => {
		initialPersonDomainParts[domain.id] = convertToFormPersonDomainPart(domain);
	});

	const initialPersonDomainPartsArr = originalPerson.connectedDomains.map(
		(domain) => {
			return convertToFormPersonDomainPart(domain);
		}
	);

	// const [personDomainParts, setPersonDomainParts] = useState(
	// 	initialPersonDomainParts
	// );

	enum PersonDomainPartActionType {
		SET_AFFILIATION_FIELD = 'set_affiliation_field',
	}

	type PersonDomainpartAction = {
		type: PersonDomainPartActionType.SET_AFFILIATION_FIELD;
		payload: {
			personDomainPartId: string;
			affiliationId: string;
			field: string;
			value: string;
		};
	};

	const personDomainPartReducer = (
		state: FormPersonDomainPart[],
		action: PersonDomainpartAction
	): FormPersonDomainPart[] => {
		const {
			type,
			payload: { personDomainPartId, affiliationId, field, value },
		} = action;
		switch (type) {
			case PersonDomainPartActionType.SET_AFFILIATION_FIELD:
				return state.map((pdp) => {
					if (pdp.id === personDomainPartId) {
						return {
							...pdp,
							affiliations: {
								...pdp.affiliations,
								[affiliationId]: {
									...pdp.affiliations[affiliationId],
									[field]: value,
								},
							},
						};
					}
					return pdp;
				});

			default: {
				throw new Error(`Unhandled action type - ${JSON.stringify(action)}`);
			}
		}
	};

	const [personDomainParts, dispatchPersonDomainParts] = useReducer(
		personDomainPartReducer,
		initialPersonDomainPartsArr
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

	const [person2, setPerson] = useState<FormPerson>(
		originalFormPersonWithEmptyDefaults
	);

	enum PersonActionType {
		UPDATE_STRING_FIELD = 'UPDATE_STRING_FIELD',
		UPDATE_ARRAY_STRING_FIELD = 'UPDATE_ARRAY_STRING_FIELD',
		ADD_ARRAY_STRING_FIELD = 'ADD_ARRAY_STRING_FIELD',
	}

	type PersonAction =
		| {
				type: PersonActionType.UPDATE_STRING_FIELD;
				payload: {
					field: string;
					value: string;
				};
		  }
		| {
				type: PersonActionType.UPDATE_ARRAY_STRING_FIELD;
				payload: {
					field: string;
					value: string;
					index: number;
				};
		  }
		| {
				type: PersonActionType.ADD_ARRAY_STRING_FIELD;
				payload: {
					field: string;
				};
		  };

	const personReducer = (
		state: FormPerson,
		action: PersonAction
	): FormPerson => {
		console.log('action', action);
		const { type, payload } = action;
		switch (type) {
			case PersonActionType.UPDATE_STRING_FIELD:
				return { ...state, [payload.field]: payload.value };
			case PersonActionType.UPDATE_ARRAY_STRING_FIELD:
				return {
					...state,
					[payload.field]: state[payload.field].map(
						(item: string, i: number) => {
							if (payload.index === i) {
								return payload.value;
							}
							return item;
						}
					),
				};
			case PersonActionType.ADD_ARRAY_STRING_FIELD:
				return {
					...state,
					[payload.field]: state[payload.field].concat(''),
				};
			default: {
				throw new Error(`Unhandled action type - ${JSON.stringify(action)}`);
			}
		}
	};

	const [person, dispatchPerson] = useReducer(
		personReducer,
		originalFormPersonWithEmptyDefaults
	);

	const handleFormChange = (newFormState: FormPerson) => {
		// console.log({ newFormState });
		// if (newFormState) {
		// 	setPerson(newFormState);
		// }
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
				<Card
					key={index}
					margin={{ top: 'small', bottom: 'small' }}
					pad="small"
				>
					<CardHeader pad="small">
						<Heading margin="none" level="6">
							Alternativt namn
						</Heading>
					</CardHeader>

					<Box direction="row" justify="between">
						<FormField
							label="Efternamn"
							name={`alternativeNames[${index}].familyName`}
							required
						/>
						<FormField
							label="Förnamn"
							name={`alternativeNames[${index}].givenName`}
						/>

						<Button
							icon={<Trash />}
							label=""
							plain
							hoverIndicator
							onClick={() => removeAlternativeName(index)}
						/>
					</Box>
				</Card>
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
					<Card
						key={index}
						margin={{ top: 'small', bottom: 'small' }}
						pad="small"
					>
						<CardHeader pad="small">
							<Heading margin="none" level="6">
								Extern url
							</Heading>
						</CardHeader>
						<Box direction="row" justify="between">
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
							<Button
								icon={<Trash />}
								plain
								hoverIndicator
								onClick={() => removeExternalLink(index)}
							/>
						</Box>
					</Card>
				);
			});
		}
	};
	updateExternalLinkGroup();

	return (
		<Grid columns={['1fr', '1fr']} gap={{ column: 'large' }}>
			<Box pad="medium" width="large">
				<Form
					// value={person}
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
						label="Lägg till alternativt namn"
						plain
						hoverIndicator
						onClick={addAlternativeName}
					/>
					<Box margin={{ top: 'large', bottom: 'large' }}>
						<FormField
							name="academicTitle"
							label="Akademisk titel"
							value={person.academicTitle}
							onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
								dispatchPerson({
									type: PersonActionType.UPDATE_STRING_FIELD,
									payload: {
										field: 'academicTitle',
										value: event.target.value,
									},
								});
							}}
						/>
						<Box direction="row" justify="between" align="center">
							<FormField label="Födelseår" name="yearOfBirth" />
							<FormField label="Dödsår" name="yearOfDeath" />
						</Box>
					</Box>

					{person.viafIDs.map((viaf, index) => {
						return (
							<Card
								direction="row"
								justify="between"
								align="center"
								margin={{ top: 'small', bottom: 'small' }}
								pad="small"
							>
								<FormField
									name="viaf"
									label="VIAF"
									value={viaf}
									onChange={React.useCallback(
										(event: React.ChangeEvent<HTMLInputElement>) => {
											dispatchPerson({
												type: PersonActionType.UPDATE_ARRAY_STRING_FIELD,
												payload: {
													field: 'viafIDs',
													index,
													value: event.target.value,
												},
											});
										},
										[index]
									)}
								/>
								<Button
									icon={<Trash />}
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
							</Card>
						);
					})}

					<Box direction="row" justify="start" margin={{ bottom: 'small' }}>
						<Button
							icon={<Add />}
							label="Lägg till VIAF"
							plain
							hoverIndicator
							onClick={() => {
								dispatchPerson({
									type: PersonActionType.ADD_ARRAY_STRING_FIELD,
									payload: {
										field: 'viafIDs',
									},
								});
								// const newArray: string[] = [];
								// if (person.viafIDs && person.viafIDs.length > 0) {
								// 	newArray.push(...person.viafIDs);
								// }
								// newArray.push('');
								// setPerson({ ...person, viafIDs: newArray });
							}}
						/>
					</Box>
					{ExternalLinkGroup}

					<Box direction="row" justify="start" margin={{ bottom: 'large' }}>
						<Button
							icon={<Add />}
							label="Lägg till extern URL"
							plain
							hoverIndicator
							onClick={addExternalLink}
						/>
					</Box>

					{person.personDomainParts &&
						person.personDomainParts.length > 0 &&
						person.personDomainParts.map((pdpId) => {
							const personDomainPart = personDomainParts.find(
								(pdp) => pdp.id === pdpId
							);
							return (
								<Box margin={{ top: 'medium' }}>
									<Text>{personDomainPart.domain}</Text>
									{Object.values(personDomainPart.affiliations).map(
										(affiliation) => {
											// const affiliation = affiliations[affiliation.id];
											return (
												<Box direction="row" justify="between" align="center">
													{/* <Text>{affiliation.name}</Text> */}
													<FormField
														label="Från"
														name={`${affiliation.id}-from`}
														value={affiliation.fromYear}
														onChange={(
															event: React.ChangeEvent<HTMLInputElement>
														) => {
															dispatchPersonDomainParts({
																type: PersonDomainPartActionType.SET_AFFILIATION_FIELD,
																payload: {
																	personDomainPartId: personDomainPart.id,
																	affiliationId: affiliation.id,
																	field: 'fromYear',
																	value: event.target.value,
																},
															});
														}}
														validate={(value: string) => {
															const regex = /^[0-9]{4}$/;
															if (
																value === undefined ||
																value === '' ||
																regex.test(value)
															) {
																return undefined;
															}
															return `Ange ett giltigt år.`;
														}}
													/>
													<FormField
														name={`${affiliation.id}-until`}
														label="Till"
														value={affiliation.untilYear}
														onChange={(
															event: React.ChangeEvent<HTMLInputElement>
														) => {
															dispatchPersonDomainParts({
																type: PersonDomainPartActionType.SET_AFFILIATION_FIELD,
																payload: {
																	personDomainPartId: personDomainPart.id,
																	affiliationId: affiliation.id,
																	field: 'untilYear',
																	value: event.target.value,
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
						<Button type="submit" label="Skicka" primary />
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
