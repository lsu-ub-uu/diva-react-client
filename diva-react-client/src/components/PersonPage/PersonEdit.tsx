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
	TextArea,
} from 'grommet';
import { Add, Trash } from 'grommet-icons';
import {
	ExternalUrl,
	Name,
	Organisation,
	OtherAffiliation,
	Person,
	PersonDomainPart,
} from 'diva-cora-ts-api-wrapper';
import getDomainCollection from '../../divaData/resources';

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
	affiliations: FormAffiliation[];
}

const convertToFormPersonDomainPart = (
	personDomainPart: PersonDomainPart
): FormPersonDomainPart => {
	let affiliations: FormAffiliation[] = [];

	if (personDomainPart.affiliations) {
		affiliations = personDomainPart.affiliations.map((affiliation) => {
			return {
				fromYear: '',
				untilYear: '',
				...affiliation,
				organisation: undefined,
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
 * - lägg till högersida
 * - organisationssök efter domain för att kunna lägga till nya organisationer
 *
 * Till specialistmötet
 * - lägga till samtliga (för alla synliga) fält
 * - lägg till validering
 * - lägg till högersida (den ska hänga med när det ändras på vänster sida)
 * -- scrollbar för båda för att kunna scrolla oberoende
 * - icke inloggad
 * - transformera från FormPerson till Person
 * - Lägg till rubriker ifrån U&Ms förslag
 * - edit-knapp
 *
 * Bonus:
 * - inloggad läge
 *
 * @param param0
 * @returns
 */

const PersonEdit = function ({ originalPerson }: { originalPerson: Person }) {
	const originalFormPersonWithEmptyDefaults: FormPerson =
		convertToFormPerson(originalPerson);

	// type FormPersonDomainPartObject = {
	// 	[key: string]: FormPersonDomainPart;
	// };

	// const initialPersonDomainParts: FormPersonDomainPart[] = [];

	// if (originalPerson.connectedDomains) {
	// 	originalPerson.connectedDomains.forEach((domain) => {
	// 		initialPersonDomainParts.push()
	// 			convertToFormPersonDomainPart(domain);
	// 	});
	// }

	const initialOrganisations: Map<string, string> = new Map();

	if (originalPerson.connectedDomains) {
		originalPerson.connectedDomains.forEach((domain) => {
			if (domain.affiliations) {
				domain.affiliations.forEach((affiliation) => {
					if (affiliation.organisation) {
						initialOrganisations.set(
							affiliation.organisation.id,
							affiliation.organisation.name
						);
					}
				});
			}
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
		DELETE_AFFILIATION = 'DELETE_AFFILIATION',
	}

	type PersonDomainpartAction =
		| {
				type: PersonDomainPartActionType.SET_AFFILIATION_FIELD;
				payload: {
					personDomainPartId: string;
					affiliationId: string;
					field: string;
					value: string;
				};
		  }
		| {
				type: PersonDomainPartActionType.DELETE_AFFILIATION;
				payload: {
					personDomainPartId: string;
					affiliationId: string;
				};
		  };

	const personDomainPartReducer = (
		state: FormPersonDomainPart[],
		action: PersonDomainpartAction
	): FormPersonDomainPart[] => {
		const { type } = action;
		const { personDomainPartId, affiliationId } = action.payload;
		switch (type) {
			case PersonDomainPartActionType.SET_AFFILIATION_FIELD:
				// eslint-disable-next-line no-case-declarations
				const {
					payload: { field, value },
				} = action;
				return state.map((personDomainPart) => {
					if (personDomainPart.id === personDomainPartId) {
						return {
							...personDomainPart,
							affiliations: personDomainPart.affiliations.map((affiliation) => {
								if (affiliation.id === affiliationId) {
									return {
										...affiliation,
										[field]: value,
									};
								}
								return affiliation;
							}),
						};
					}
					return personDomainPart;
				});
			case PersonDomainPartActionType.DELETE_AFFILIATION:
				return state.map((personDomainpart) => {
					if (personDomainpart.id === personDomainPartId) {
						return {
							...personDomainpart,
							affiliations: personDomainpart.affiliations.filter(
								(item: any) => {
									return item.id !== affiliationId;
								}
							),
						};
					}
					return personDomainpart;
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
								validate={validateWithRegex(
									/^[0-9]{4}$/,
									'Ange ett giltigt år.'
								)}
							/>
							<StringFormField
								label="Dödsår"
								field="yearOfDeath"
								value={person.yearOfDeath}
								onChange={updateStringField}
								validate={validateWithRegex(
									/^[0-9]{4}$/,
									'Ange ett giltigt år.'
								)}
							/>
						</Box>
					</Box>

					<Box margin={{ top: 'large', bottom: 'large' }}>
						{person.librisIDs.map((librisId, index) => {
							return (
								<Card
									direction="row"
									justify="between"
									align="center"
									margin={{ top: 'small', bottom: 'small' }}
									pad="small"
								>
									<FormField
										name={`libris-${index}`}
										label="Libris ID"
										value={librisId}
										onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
											dispatchPerson({
												type: PersonActionType.UPDATE_ARRAY_STRING_FIELD,
												payload: {
													field: 'librisIDs',
													index,
													value: event.target.value,
												},
											});
										}}
										validate={validateWithRegex(
											/(^[0-9]{2,10}$)|(^https:\/\/libris\.kb\.se\/[0-9A-Za-z.#]{2,50}$)/,
											`Ange ett giltigt Libris-ID`
										)}
									/>
									<Button
										icon={<Trash />}
										plain
										hoverIndicator
										onClick={() => {
											dispatchPerson({
												type: PersonActionType.DELETE_ARRAY_WITH_INDEX,
												payload: {
													field: 'librisIDs',
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
								label="Lägg till Libris ID"
								plain
								hoverIndicator
								onClick={() => {
									dispatchPerson({
										type: PersonActionType.ADD_ARRAY_STRING_FIELD,
										payload: {
											field: 'librisIDs',
										},
									});
								}}
							/>
						</Box>
					</Box>

					<Box margin={{ top: 'large', bottom: 'large' }}>
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
										validate={validateWithRegex(
											/^[1-9]\d(\d{0,7}|\d{17,20})$/,
											`Ange ett giltigt VIAF-ID`
										)}
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
					</Box>

					<Box margin={{ top: 'large', bottom: 'large' }}>
						{person.orcids.map((orcid, index) => {
							return (
								<Card
									direction="row"
									justify="between"
									align="center"
									margin={{ top: 'small', bottom: 'small' }}
									pad="small"
								>
									<FormField
										name={`orcid-${index}`}
										label="ORCID"
										value={orcid}
										validate={validateWithRegex(
											/^(\d{4})-(\d{4})-(\d{4})-(\d{3}[0-9X])$/,
											`Ange ett giltigt ORCID`
										)}
										disabled
									/>
								</Card>
							);
						})}
					</Box>

					<Box margin={{ top: 'large', bottom: 'large' }}>
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
											onChange={(
												event: React.ChangeEvent<HTMLInputElement>
											) => {
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
											onChange={(
												event: React.ChangeEvent<HTMLInputElement>
											) => {
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
											validate={validateWithRegex(
												/(?=^.{3,255}$)^(https?:\/\/(www\.)?)?[-a-zA-Z0-9@:%._+~#=]{1,240}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
												`Ange en giltig URL.`
											)}
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

						<Box direction="row" justify="start" margin={{ top: 'small' }}>
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
					</Box>

					<Box margin={{ top: 'large', bottom: 'large' }}>
						<FormField
							label="Biografi"
							value={person.biographySwedish}
							component={TextArea}
						/>
						<FormField
							label="Biography"
							value={person.biographyEnglish}
							component={TextArea}
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
							const title =
								getDomainCollection().get(personDomainPart.domain) ||
								`DomänId: ${personDomainPart.domain}`;
							return (
								<Box margin={{ top: 'large', bottom: 'large' }}>
									<Heading margin="none" level="5">
										{title}
									</Heading>
									{/* <Text>{personDomainPart.domain}</Text> */}
									{Object.values(personDomainPart.affiliations).map(
										(affiliation) => {
											const organisationName =
												initialOrganisations.get(affiliation.id) ||
												affiliation.id;
											// const affiliation = affiliations[affiliation.id];
											return (
												<Card
													// eslint-disable-next-line react/no-array-index-key
													key={affiliation.id}
													margin={{ top: 'small', bottom: 'small' }}
													pad="small"
												>
													<CardHeader pad="small">
														<Heading margin="none" level="6">
															{organisationName}
														</Heading>
													</CardHeader>
													{/* <Text>{affiliation.name}</Text> */}
													<Box direction="row" justify="between">
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
															validate={validateWithRegex(
																/^[0-9]{4}$/,
																'Ange ett giltigt år.'
															)}
														/>
														<FormField
															name={`${affiliation.id}-until`}
															label="Till"
															value={affiliation.untilYear}
															validate={validateWithRegex(
																/^[0-9]{4}$/,
																'Ange ett giltigt år.'
															)}
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
														<Button
															icon={<Trash />}
															label=""
															plain
															hoverIndicator
															onClick={() => {
																dispatchPersonDomainParts({
																	type: PersonDomainPartActionType.DELETE_AFFILIATION,
																	payload: {
																		personDomainPartId: personDomainPart.id,
																		affiliationId: affiliation.id,
																	},
																});
															}}
														/>
													</Box>
												</Card>
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

				<h2>Person</h2>
				<pre>{JSON.stringify(person, null, 2)}</pre>
				<h2>Organisations</h2>
				<pre>
					{JSON.stringify(
						Object.fromEntries(initialOrganisations.entries()),
						null,
						2
					)}
				</pre>
				<h2>PersonDomainParts</h2>
				<pre>{JSON.stringify(personDomainParts, null, 2)}</pre>
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
	validate = undefined,
}: {
	label: string;
	value: string;
	field: string;
	onChange: (field: string, value: string) => void;
	// eslint-disable-next-line react/require-default-props
	validate?: (value: string) => string | undefined;
}) {
	return (
		<FormField
			name={field}
			label={label}
			value={value}
			onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
				onChange(field, event.target.value);
			}}
			validate={validate}
		/>
	);
};

const validateWithRegex =
	(regex: RegExp, invalidMessage: string) => (value: string) => {
		if (value === undefined || value === '' || regex.test(value)) {
			return undefined;
		}
		return invalidMessage;
	};

export default PersonEdit;
