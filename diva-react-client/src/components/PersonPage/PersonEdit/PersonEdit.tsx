/* eslint-disable react/require-default-props */
import React, { useReducer, useState, useEffect } from 'react';
import {
	Box,
	Button,
	Card,
	CardHeader,
	Heading,
	Form,
	FormField,
	Grid,
	TextArea,
	RadioButtonGroup,
	Text,
	TextAreaExtendedProps,
} from 'grommet';
import { Add, Trash } from 'grommet-icons';
import {
	Name,
	Organisation,
	Person,
	PersonDomainPart,
	searchOrganisationsByDomain,
} from 'diva-cora-ts-api-wrapper';
import getDomainCollection from '../../../divaData/resources';
import PersonViewEdit from '../PersonViewEdit';
import { useAuth } from '../../../context/AuthContext';
import {
	PersonDomainPartActionType,
	personDomainPartReducer,
} from './personDomainPartReducer';
import { PersonAction, PersonActionType, personReducer } from './personReducer';
import BackButton from '../../BackButton';
import { convertToFormPerson, FormPerson } from '../../../types/FormPerson';
import {
	convertToFormPersonDomainPart,
	FormPersonDomainPart,
} from '../../../types/FormPersonDomainPart';
import { Repeatable } from '../../../types/Repeatable';

const INVALID_YEAR_MESSAGE = 'Ange ett giltigt år';
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
 * - X lägga till samtliga (för alla synliga) fält X
 * - X lägg till validering X
 * - X lägg till högersida (den ska hänga med när det ändras på vänster sida) X
 * -- scrollbar för båda för att kunna scrolla oberoende
 * - icke inloggad
 * - transformera från FormPerson till Person
 * - Lägg till rubriker ifrån U&Ms förslag
 * - edit-knapp
 *
 * Bonus:
 * - inloggad läge
 *
 * GUI
 * - jobba med "editera"-knappen
 * - "lokal identifikator" i inloggad läge i vyn
 * - Nice-to-have: Tillbaka-knappen - att den är på bra ställe oavsett om vi är i edit eller vy läge
 * - Listan på alternativa namn i vy
 * -- de ser konstiga ut i presentationen, jobba med formateringen
 * -- När en lägger till ett nytt alternativt namn dyker det upp ett komma
 *
 * @param param0
 * @returns
 */

const PersonEdit = function ({
	originalPerson,
	originalPersonDomainParts = [],
	originalOrganisations = [],
}: {
	originalPerson: Person;
	originalPersonDomainParts?: PersonDomainPart[];
	originalOrganisations?: Organisation[];
}) {
	const { auth } = useAuth();

	const originalFormPersonWithEmptyDefaults: FormPerson =
		convertToFormPerson(originalPerson);

	const initialOrganisations: Map<string, string> = new Map();

	originalOrganisations.forEach((organisation) => {
		initialOrganisations.set(organisation.id, organisation.name);
	});

	const [organisationMap, setOrganisationMap] = useState(initialOrganisations);

	const [domainOrganisations, setDomainOrganisations] = useState<
		Organisation[]
	>([]);

	useEffect(() => {
		searchOrganisationsByDomain(auth.domain, auth.token).then((list) => {
			const organisations = list.data as Organisation[];
			setDomainOrganisations(organisations);

			const newOrganisationMap = new Map(organisationMap);

			organisations.forEach((organisation) => {
				const { id, name } = organisation;
				newOrganisationMap.set(id, name);
			});

			setOrganisationMap(newOrganisationMap);
		});
	}, []);

	const initialPersonDomainPartsArr: FormPersonDomainPart[] =
		originalPersonDomainParts.map((personDomainPart) => {
			return convertToFormPersonDomainPart(personDomainPart);
		});

	const [personDomainParts, dispatchPersonDomainParts] = useReducer(
		personDomainPartReducer,
		initialPersonDomainPartsArr
	);

	const updateStringField = React.useCallback(
		(field: string, value: string) => {
			const castField = field as keyof FormPerson;
			dispatchPerson({
				type: PersonActionType.UPDATE_STRING_FIELD,
				payload: {
					field: castField,
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
				<Form
					validate="blur"
					messages={{ required: 'Fältet får inte vara tomt' }}
				>
					<Box direction="row" justify="between" align="center">
						<MemoizedFormField
							label="Efternamn"
							required
							value={person.authorisedName.familyName}
							onChange={React.useCallback(
								(event: React.ChangeEvent<HTMLInputElement>) => {
									dispatchPerson({
										type: PersonActionType.UPDATE_OBJECT,
										payload: {
											field: 'authorisedName',
											childField: 'familyName',
											value: event.target.value,
										},
									});
								},
								[]
							)}
						/>
						<MemoizedFormField
							label="Förnamn"
							value={person.authorisedName.givenName}
							onChange={React.useCallback(
								(event: React.ChangeEvent<HTMLInputElement>) => {
									dispatchPerson({
										type: PersonActionType.UPDATE_OBJECT,
										payload: {
											field: 'authorisedName',
											childField: 'givenName',
											value: event.target.value,
										},
									});
								},
								[]
							)}
						/>
					</Box>
					{person.alternativeNames.map((repeatable) => (
						<AlternativeNameForm
							key={repeatable.repeatId}
							repeatable={repeatable}
							dispatchPerson={dispatchPerson}
						/>
					))}
					<AddButton
						label="Lägg till alternativt namn"
						plain
						onClick={React.useCallback(() => {
							dispatchPerson({
								type: PersonActionType.ADD_ARRAY_OBJECT,
								payload: {
									field: 'alternativeNames',
									emptyObject: { familyName: '', givenName: '' },
								},
							});
						}, [])}
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
								validate={validateWithRegex(/^[0-9]{4}$/, INVALID_YEAR_MESSAGE)}
							/>
							<StringFormField
								label="Dödsår"
								field="yearOfDeath"
								value={person.yearOfDeath}
								onChange={updateStringField}
								validate={validateWithRegex(/^[0-9]{4}$/, INVALID_YEAR_MESSAGE)}
							/>
						</Box>
					</Box>

					<Box margin={{ top: 'large', bottom: 'large' }}>
						{/* Break out as sub-component */}
						<StringArray
							stringArray={person.librisIDs}
							label="Libris ID"
							field="librisIDs"
							dispatchPerson={dispatchPerson}
						/>
					</Box>

					<Box margin={{ top: 'large', bottom: 'large' }}>
						<StringArray
							stringArray={person.viafIDs}
							label="VIAF"
							field="viafIDs"
							dispatchPerson={dispatchPerson}
						/>
					</Box>

					<Box margin={{ top: 'large', bottom: 'large' }}>
						{person.orcids.map((identifier, index) => {
							if (identifier === '') {
								return null;
							}
							return (
								<Card
									key={identifier}
									direction="row"
									justify="between"
									align="center"
									margin={{ top: 'small', bottom: 'small' }}
									pad="small"
								>
									<MemoizedFormField
										name={`orcid-${index}`}
										label="ORCID"
										value={identifier}
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
						{person.externalURLs.map(({ content: externalURL, repeatId }) => {
							return (
								<Card
									// eslint-disable-next-line react/no-array-index-key
									key={repeatId}
									margin={{ top: 'small', bottom: 'small' }}
									pad="small"
								>
									<CardHeader pad="small">
										<Heading margin="none" level="6">
											Extern url
										</Heading>
									</CardHeader>
									<Box direction="row" justify="between">
										<MemoizedFormField
											label="Länktext"
											name={`externalURLs[${repeatId}].linkTitle`}
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
														index: repeatId,
													},
												});
											}}
											required
										/>
										<MemoizedFormField
											label="URL"
											name={`externalURLs[${repeatId}].URL`}
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
														index: repeatId,
													},
												});
											}}
											required
											validate={validateWithRegex(
												/(?=^.{3,255}$)^(https?:\/\/(www\.)?)?[-a-zA-Z0-9@:%._+~#=]{1,240}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
												`Ange en giltig URL.`
											)}
										/>
										<TrashButton
											onClick={() => {
												dispatchPerson({
													type: PersonActionType.DELETE_ARRAY_WITH_INDEX,
													payload: {
														field: 'externalURLs',
														index: repeatId,
													},
												});
											}}
										/>
									</Box>
								</Card>
							);
						})}

						<Box direction="row" justify="start" margin={{ top: 'small' }}>
							<AddButton
								label="Lägg till extern URL"
								onClick={React.useCallback(() => {
									dispatchPerson({
										type: PersonActionType.ADD_ARRAY_OBJECT,
										payload: {
											field: 'externalURLs',
											emptyObject: { linkTitle: '', URL: '' },
										},
									});
								}, [])}
							/>
						</Box>
					</Box>

					<Box margin={{ top: 'large', bottom: 'large' }}>
						<MemoizedFormField
							key="biografi"
							label="Biografi"
							value={person.biographySwedish}
							component={TextArea}
						/>
						<MemoizedFormField
							key="biography"
							label="Biography"
							value={person.biographyEnglish}
							component={TextArea}
						/>
					</Box>

					{person.personDomainParts.length > 0 &&
						person.personDomainParts.map((pdpId) => {
							const personDomainPart = personDomainParts.find(
								(pdp) => pdp.id === pdpId
							);
							if (
								!personDomainPart ||
								personDomainPart.domain !== auth.domain
							) {
								return null;
							}
							const title =
								getDomainCollection().get(personDomainPart.domain) ||
								`DomänId: ${personDomainPart.domain}`;
							return (
								<Box
									margin={{ top: 'large', bottom: 'large' }}
									key={personDomainPart.id}
								>
									<Heading margin="none" level="5">
										{title}
									</Heading>
									{/* <Text>{personDomainPart.domain}</Text> */}
									{Object.values(personDomainPart.affiliations).map(
										(affiliation, index) => {
											// const affiliation = affiliations[affiliation.id];
											return (
												<Card
													// eslint-disable-next-line react/no-array-index-key
													key={`${personDomainPart.id}-${affiliation.id}-${index}`}
													margin={{ top: 'small', bottom: 'small' }}
													pad="small"
												>
													<CardHeader pad="small">
														{affiliation.id !== '' && (
															<Heading margin="none" level="6">
																{organisationMap.get(affiliation.id) ||
																	affiliation.id}
															</Heading>
														)}
														{/* {affiliation.id === '' && <OrganisationChooser />} */}
													</CardHeader>
													{/* <Text>{affiliation.name}</Text> */}
													<Box direction="row" justify="between">
														<MemoizedFormField
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
																INVALID_YEAR_MESSAGE
															)}
														/>
														<MemoizedFormField
															name={`${affiliation.id}-until`}
															label="Till"
															value={affiliation.untilYear}
															validate={validateWithRegex(
																/^[0-9]{4}$/,
																INVALID_YEAR_MESSAGE
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
														<TrashButton
															plain
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

					<Box align="start" pad={{ left: 'medium' }}>
						<Box margin={{ bottom: 'small' }}>
							<Text>Publik</Text>
						</Box>
						<RadioButtonGroup
							name="radio"
							options={[
								{ label: 'Ja', value: 'yes' },
								{ label: 'Nej', value: 'no' },
							]}
							onChange={React.useCallback(
								(event) => console.log(event.target.value),
								[]
							)}
						/>
					</Box>

					<Box direction="column" align="end" margin={{ top: 'medium' }}>
						<Button
							type="submit"
							label="Skicka"
							primary
							onClick={() => {
								alert('Skickar...');
							}}
						/>
					</Box>
				</Form>
			</Box>
			<Box>
				{/* <pre>{JSON.stringify(affiliations, null, 2)}</pre> */}

				<PersonViewEdit
					person={person}
					organisations={organisationMap}
					personDomainParts={personDomainParts}
				/>

				{/* <h2>Person</h2>
				<pre>{JSON.stringify(person, null, 2)}</pre>
				<h2>Organisations</h2>
				<pre>
					{JSON.stringify(
						Object.fromEntries(organisationMap.entries()),
						null,
						2
					)}
				</pre>
				<h2>PersonDomainParts</h2>
				<pre>{JSON.stringify(personDomainParts, null, 2)}</pre> */}
			</Box>
			{/* <PersonView person={person} /> */}
			<Box margin={{ left: '1em', top: '1em' }}>
				<BackButton />
			</Box>
		</Grid>
	);
};

const MemoizedFormField = React.memo(
	({
		label,
		required = false,
		disabled = false,
		value,
		onChange = undefined,
		name = undefined,
		validate = undefined,
		component = undefined,
	}: {
		label: string;
		required?: boolean;
		disabled?: boolean;
		value: string;
		onChange?: React.ChangeEventHandler<HTMLInputElement> &
			((event: React.ChangeEvent<HTMLInputElement>) => void);
		name?: string;
		validate?: (value: string) => string | undefined;
		component?: React.FC<TextAreaExtendedProps>;
	}) => {
		return (
			<FormField
				label={label}
				name={name}
				required={required}
				value={value}
				onChange={onChange}
				validate={validate}
				component={component}
				disabled={disabled}
			/>
		);
	}
);

const AlternativeNameForm = React.memo(
	({
		repeatable: { repeatId, content: alternativeName },
		dispatchPerson,
	}: {
		repeatable: Repeatable<Name>;
		dispatchPerson: (value: PersonAction) => void;
	}) => {
		return (
			<Card
				// eslint-disable-next-line react/no-array-index-key
				key={repeatId}
				margin={{ top: 'small', bottom: 'small' }}
				pad="small"
			>
				<CardHeader pad="small">
					<Heading margin="none" level="6">
						Alternativt namn
					</Heading>
				</CardHeader>

				<Box direction="row" justify="between">
					<MemoizedFormField
						label="Efternamn"
						name={alternativeName.familyName}
						value={alternativeName.familyName}
						onChange={React.useCallback(
							(event: React.ChangeEvent<HTMLInputElement>) => {
								dispatchPerson({
									type: PersonActionType.UPDATE_ARRAY_OBJECT_FIELD,
									payload: {
										field: 'alternativeNames',
										childField: 'familyName',
										value: event.target.value,
										index: repeatId,
									},
								});
							},
							[repeatId]
						)}
						required
					/>
					<MemoizedFormField
						label="Förnamn"
						name={alternativeName.givenName}
						value={alternativeName.givenName}
						onChange={React.useCallback(
							(event: React.ChangeEvent<HTMLInputElement>) => {
								dispatchPerson({
									type: PersonActionType.UPDATE_ARRAY_OBJECT_FIELD,
									payload: {
										field: 'alternativeNames',
										childField: 'givenName',
										value: event.target.value,
										index: repeatId,
									},
								});
							},
							[repeatId]
						)}
					/>

					<TrashButton
						onClick={() => {
							dispatchPerson({
								type: PersonActionType.DELETE_ARRAY_WITH_ID,
								payload: {
									field: 'alternativeNames',
									repeatId,
								},
							});
						}}
					/>
				</Box>
			</Card>
		);
	}
);

const StringArray = function ({
	stringArray,
	label,
	field,
	dispatchPerson,
}: {
	stringArray: string[];
	label: string;
	field: keyof FormPerson;
	dispatchPerson: (value: PersonAction) => void;
}) {
	return (
		<>
			{stringArray.map((value, index) => {
				return (
					<Card
						// eslint-disable-next-line react/no-array-index-key
						key={`libris-${index}`}
						direction="row"
						justify="between"
						align="center"
						margin={{ top: 'small', bottom: 'small' }}
						pad="small"
					>
						<MemoizedFormField
							name={`${field}-${index}`}
							label={label}
							value={value}
							onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
								dispatchPerson({
									type: PersonActionType.UPDATE_ARRAY_STRING_FIELD,
									payload: {
										field,
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
						<TrashButton
							onClick={() => {
								dispatchPerson({
									type: PersonActionType.DELETE_ARRAY_WITH_INDEX,
									payload: {
										field,
										index,
									},
								});
							}}
						/>
					</Card>
				);
			})}
			<Box direction="row" justify="start" margin={{ bottom: 'small' }}>
				<AddButton
					label={`Lägg till ${label}`}
					plain
					onClick={React.useCallback(() => {
						dispatchPerson({
							type: PersonActionType.ADD_ARRAY_STRING_FIELD,
							payload: {
								field,
							},
						});
					}, [field])}
				/>
			</Box>
		</>
	);
};

const StringFormField = React.memo(
	({
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
	}) => {
		return (
			<MemoizedFormField
				name={field}
				label={label}
				value={value}
				onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
					onChange(field, event.target.value);
				}}
				validate={validate}
			/>
		);
	}
);

const TrashButton = React.memo(
	({
		onClick,
		plain = undefined,
	}: {
		onClick: () => void;
		// eslint-disable-next-line react/require-default-props
		plain?: boolean;
	}) => {
		return (
			<Button
				icon={<Trash />}
				label=""
				plain={plain}
				hoverIndicator
				onClick={onClick}
			/>
		);
	}
);
const AddButton = React.memo(
	({
		onClick,
		plain = undefined,
		label,
	}: {
		onClick: () => void;
		// eslint-disable-next-line react/require-default-props
		plain?: boolean;
		label: string;
	}) => {
		return (
			<Button
				icon={<Add />}
				label={label}
				plain={plain}
				hoverIndicator
				onClick={onClick}
			/>
		);
	}
);

const validateWithRegex =
	(regex: RegExp, invalidMessage: string) => (value: string) => {
		if (value === undefined || value === '' || regex.test(value)) {
			return undefined;
		}
		return invalidMessage;
	};

export default PersonEdit;
