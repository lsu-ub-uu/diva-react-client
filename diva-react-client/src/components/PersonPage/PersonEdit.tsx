import React, { useReducer } from 'react';
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
	OtherAffiliation,
	Person,
	PersonDomainPart,
} from 'diva-cora-ts-api-wrapper';

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

	if (personDomainPart.affiliations) {
		personDomainPart.affiliations.forEach((affiliation) => {
			affiliations[affiliation.id] = {
				fromYear: '',
				untilYear: '',
				...affiliation,
			};
		});
	}

	return {
		id: personDomainPart.id,
		domain: personDomainPart.domain,
		affiliations,
		identifiers: personDomainPart.identifiers || [],
	};
};

/**
 *
 *
 * Vi behöver:
 * - Personen
 * - personDomainParts för de domäner som nuvarande användaren har rättighet till
 * - organisationsnamnen som är kopplade till ovannämnda personDomainParts
 *
 * Vi har:
 * - Vi får in HELA personen, inklusive persondomainparts och organisationer
 * - en basal uppsättning formulärfält som vi kan använda
 * - transformering från person till FormPerson
 *
 *
 * Vi behöver göra:
 * - lägga till samtliga fält
 * - undersöka om bara vissa fält får visas
 * - lägga till validering till berörda fält
 * -
 * - transformera från FormPerson till Person
 * - transformera från Person till CoraData
 * - skicka update
 * - testa på något sätt
 *
 *
 * @param param0
 * @returns
 */

const PersonEdit = function ({ originalPerson }: { originalPerson: Person }) {
	const originalFormPersonWithEmptyDefaults: FormPerson =
		convertToFormPerson(originalPerson);

	type FormPersonDomainPartObject = {
		[key: string]: FormPersonDomainPart;
	};

	const initialPersonDomainParts: FormPersonDomainPartObject = {};

	if (originalPerson.connectedDomains) {
		originalPerson.connectedDomains.forEach((domain) => {
			initialPersonDomainParts[domain.id] =
				convertToFormPersonDomainPart(domain);
		});
	}

	let initialPersonDomainPartsArr: FormPersonDomainPart[] = [];

	if (originalPerson.connectedDomains) {
		initialPersonDomainPartsArr = originalPerson.connectedDomains.map(
			(domain) => {
				return convertToFormPersonDomainPart(domain);
			}
		);
	}

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

	enum PersonActionType {
		UPDATE_STRING_FIELD = 'UPDATE_STRING_FIELD',
		UPDATE_ARRAY_STRING_FIELD = 'UPDATE_ARRAY_STRING_FIELD',
		ADD_ARRAY_STRING_FIELD = 'ADD_ARRAY_STRING_FIELD',
		DELETE_ARRAY_WITH_INDEX = 'DELETE_ARRAY_WITH_INDEX',
		UPDATE_ARRAY_OBJECT_FIELD = 'UPDATE_ARRAY_OBJECT_FIELD',
		ADD_ARRAY_OBJECT = 'ADD_ARRAY_OBJECT',
		UPDATE_OBJECT = 'UPDATE_OBJECT',
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
				type: PersonActionType.ADD_ARRAY_STRING_FIELD;
				payload: {
					field: string;
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
				type: PersonActionType.UPDATE_OBJECT;
				payload: {
					field: string;
					childField: string;
					value: string;
				};
		  }
		| {
				type: PersonActionType.ADD_ARRAY_OBJECT;
				payload: {
					field: string;
					emptyObject: Name | ExternalUrl;
				};
		  }
		| {
				type: PersonActionType.UPDATE_ARRAY_OBJECT_FIELD;
				payload: {
					field: string;
					childField: string;
					value: string;
					index: number;
				};
		  }
		| {
				type: PersonActionType.DELETE_ARRAY_WITH_INDEX;
				payload: {
					field: string;
					index: number;
				};
		  };

	const personReducer = (
		state: FormPerson,
		action: PersonAction
	): FormPerson => {
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
			case PersonActionType.UPDATE_ARRAY_OBJECT_FIELD:
				return {
					...state,
					[payload.field]: state[payload.field].map(
						(item: Name | ExternalUrl, i: number) => {
							if (payload.index === i) {
								return {
									...item,
									[payload.childField]: payload.value,
								};
							}
							return item;
						}
					),
				};
			case PersonActionType.DELETE_ARRAY_WITH_INDEX:
				return {
					...state,
					[payload.field]: state[payload.field].filter(
						(item: any, i: number) => {
							if (i !== payload.index) {
								return item;
							}
						}
					),
				};
			case PersonActionType.ADD_ARRAY_OBJECT:
				return {
					...state,
					[payload.field]: state[payload.field].concat(payload.emptyObject),
				};
			case PersonActionType.UPDATE_OBJECT:
				return {
					...state,
					[payload.field]: {
						...state[payload.field],
						[payload.childField]: payload.value,
					},
				};
			default: {
				throw new Error(`Unhandled action type - ${JSON.stringify(action)}`);
			}
		}
	};

	const updateStringField = React.useCallback(
		(field: string, value: string) => {
			dispatchPerson({
				type: PersonActionType.UPDATE_STRING_FIELD,
				payload: {
					field,
					value,
				},
			});
		},
		[]
	);

	const [person, dispatchPerson] = useReducer(
		personReducer,
		originalFormPersonWithEmptyDefaults
	);

	return (
		<Grid columns={['1fr', '1fr']} gap={{ column: 'large' }}>
			<Box pad="medium" width="large">
				<Form validate="blur">
					<Box direction="row" justify="between" align="center">
						<FormField
							label="Efternamn"
							required
							value={person.authorisedName.familyName}
							onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
								dispatchPerson({
									type: PersonActionType.UPDATE_OBJECT,
									payload: {
										field: 'authorisedName',
										childField: 'familyName',
										value: event.target.value,
									},
								});
							}}
						/>
						<FormField
							label="Förnamn"
							value={person.authorisedName.givenName}
							onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
								dispatchPerson({
									type: PersonActionType.UPDATE_OBJECT,
									payload: {
										field: 'authorisedName',
										childField: 'givenName',
										value: event.target.value,
									},
								});
							}}
						/>
					</Box>
					{person.alternativeNames.map((alternativeName, index) => (
						<Card
							// eslint-disable-next-line react/no-array-index-key
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
									name={alternativeName.familyName}
									value={alternativeName.familyName}
									onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
										dispatchPerson({
											type: PersonActionType.UPDATE_ARRAY_OBJECT_FIELD,
											payload: {
												field: 'alternativeNames',
												childField: 'familyName',
												value: event.target.value,
												index,
											},
										});
									}}
									required
								/>
								<FormField
									label="Förnamn"
									name={alternativeName.givenName}
									value={alternativeName.givenName}
									onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
										dispatchPerson({
											type: PersonActionType.UPDATE_ARRAY_OBJECT_FIELD,
											payload: {
												field: 'alternativeNames',
												childField: 'givenName',
												value: event.target.value,
												index,
											},
										});
									}}
								/>

								<Button
									icon={<Trash />}
									label=""
									plain
									hoverIndicator
									onClick={() => {
										dispatchPerson({
											type: PersonActionType.DELETE_ARRAY_WITH_INDEX,
											payload: {
												field: 'alternativeNames',
												index,
											},
										});
									}}
								/>
							</Box>
						</Card>
					))}
					<Button
						icon={<Add />}
						label="Lägg till alternativt namn"
						plain
						hoverIndicator
						onClick={() => {
							dispatchPerson({
								type: PersonActionType.ADD_ARRAY_OBJECT,
								payload: {
									field: 'alternativeNames',
									emptyObject: { familyName: '', givenName: '' },
								},
							});
						}}
					/>
					<Box margin={{ top: 'large', bottom: 'large' }}>
						<StringFormField
							label="Akademisk titel"
							field="academicTitle"
							value={person.academicTitle}
							onChange={updateStringField}
						/>
						<Box direction="row" justify="between" align="center">
							<StringFormField
								label="Födelseår"
								field="yearOfBirth"
								value={person.yearOfBirth}
								onChange={updateStringField}
							/>
							<StringFormField
								label="Dödsår"
								field="yearOfDeath"
								value={person.yearOfDeath}
								onChange={updateStringField}
							/>
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
									name={`viaf-${index}`}
									label="VIAF"
									value={viaf}
									onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
										dispatchPerson({
											type: PersonActionType.UPDATE_ARRAY_STRING_FIELD,
											payload: {
												field: 'viafIDs',
												index,
												value: event.target.value,
											},
										});
									}}
								/>
								<Button
									icon={<Trash />}
									plain
									hoverIndicator
									onClick={() => {
										dispatchPerson({
											type: PersonActionType.DELETE_ARRAY_WITH_INDEX,
											payload: {
												field: 'viafIDs',
												index,
											},
										});
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
							}}
						/>
					</Box>
					{person.externalURLs.map((externalURL, index) => {
						return (
							<Card
								// eslint-disable-next-line react/no-array-index-key
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
										value={externalURL.linkTitle}
										onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
											dispatchPerson({
												type: PersonActionType.UPDATE_ARRAY_OBJECT_FIELD,
												payload: {
													field: 'externalURLs',
													childField: 'linkTitle',
													value: event.target.value,
													index,
												},
											});
										}}
										required
									/>
									<FormField
										label="URL"
										name={`externalURLs[${index}].URL`}
										value={externalURL.URL}
										onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
											dispatchPerson({
												type: PersonActionType.UPDATE_ARRAY_OBJECT_FIELD,
												payload: {
													field: 'externalURLs',
													childField: 'URL',
													value: event.target.value,
													index,
												},
											});
										}}
										required
										validate={(value: string) => {
											const regex =
												/(?=^.{3,255}$)^(https?:\/\/(www\.)?)?[-a-zA-Z0-9@:%._+~#=]{1,240}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;
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
										onClick={() => {
											dispatchPerson({
												type: PersonActionType.DELETE_ARRAY_WITH_INDEX,
												payload: {
													field: 'externalURLs',
													index,
												},
											});
										}}
									/>
								</Box>
							</Card>
						);
					})}

					<Box direction="row" justify="start" margin={{ bottom: 'large' }}>
						<Button
							icon={<Add />}
							label="Lägg till extern URL"
							plain
							hoverIndicator
							onClick={() => {
								dispatchPerson({
									type: PersonActionType.ADD_ARRAY_OBJECT,
									payload: {
										field: 'externalURLs',
										emptyObject: { linkTitle: '', URL: '' },
									},
								});
							}}
						/>
					</Box>

					{person.personDomainParts &&
						person.personDomainParts.length > 0 &&
						person.personDomainParts.map((pdpId) => {
							const personDomainPart = personDomainParts.find(
								(pdp) => pdp.id === pdpId
							);
							if (!personDomainPart) {
								return null;
							}
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

const StringFormField = function ({
	label,
	value,
	field,
	onChange,
}: {
	label: string;
	value: string;
	field: string;
	onChange: (field: string, value: string) => void;
}) {
	return (
		<FormField
			name={field}
			label={label}
			value={value}
			onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
				onChange(field, event.target.value);
			}}
		/>
	);
};

export default PersonEdit;
