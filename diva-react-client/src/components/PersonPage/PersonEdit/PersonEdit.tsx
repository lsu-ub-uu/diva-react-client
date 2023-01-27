/* eslint-disable react/require-default-props */
import React, { useReducer } from 'react';
import { Box, Button, Card, Form, Grid } from 'grommet';
import {
	Organisation,
	Person,
	PersonDomainPart,
} from 'diva-cora-ts-api-wrapper';
import { useAuth } from '../../../context/AuthContext';
import { personDomainPartReducer } from './personDomainPartReducer';
import { PersonActionType, personReducer } from './personReducer';
import BackButton from '../../Buttons/BackButton';
import { convertToFormPerson, FormPerson } from '../../../types/FormPerson';
import {
	convertToFormPersonDomainPart,
	FormPersonDomainPart,
} from '../../../types/FormPersonDomainPart';
import { OtherOrganisation } from './OtherOrganisation';
import { MemoizedTextArea, MemoizedTextField } from './MemoizedFormField';
import { StringFormField } from './StringFormField';
import { StringArray } from './StringArray';
import { AlternativeNames } from './AlternativeNames';
import { ExternalUrls } from './ExternalUrls';
import { Public } from './Public';
import { PersonDomainParts } from './PersonDomainParts';
import FormPersonView from '../FormPersonView';

export const INVALID_YEAR_MESSAGE = 'Ange ett giltigt år';

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

	const organisationMap = initialOrganisations;

	// const [organisationMap, setOrganisationMap] = useState(initialOrganisations);

	// const [domainOrganisations, setDomainOrganisations] = useState<
	// 	Organisation[]
	// >([]);

	// useEffect(() => {
	// 	searchOrganisationsByDomain(auth.domain, auth.token).then((list) => {
	// 		const organisations = list.data as Organisation[];
	// 		setDomainOrganisations(organisations);

	// 		const newOrganisationMap = new Map(organisationMap);

	// 		organisations.forEach((organisation) => {
	// 			const { id, name } = organisation;
	// 			newOrganisationMap.set(id, name);
	// 		});

	// 		setOrganisationMap(newOrganisationMap);
	// 	});
	// }, []);

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
		<Grid
			columns={['1fr', '1fr']}
			gap={{ column: 'large' }}
		>
			<Box
				pad='medium'
				width='large'
			>
				<Form
					validate='blur'
					messages={{ required: 'Fältet får inte vara tomt' }}
				>
					<Box
						direction='row'
						justify='between'
						align='center'
					>
						<MemoizedTextField
							label='Efternamn'
							required
							value={person.authorisedName.familyName}
							onChange={React.useCallback(
								(
									event: React.ChangeEvent<HTMLInputElement>
								) => {
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
						<MemoizedTextField
							label='Förnamn'
							value={person.authorisedName.givenName}
							onChange={React.useCallback(
								(
									event: React.ChangeEvent<HTMLInputElement>
								) => {
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
					<AlternativeNames
						alternativeNames={person.alternativeNames}
						dispatchPerson={dispatchPerson}
					/>
					<Box margin={{ top: 'large', bottom: 'large' }}>
						<StringFormField
							label='Akademisk titel'
							field='academicTitle'
							value={person.academicTitle}
							onChange={updateStringField}
						/>
						<Box
							direction='row'
							justify='between'
							align='center'
						>
							<StringFormField
								label='Födelseår'
								field='yearOfBirth'
								value={person.yearOfBirth}
								onChange={updateStringField}
								validate={validateWithRegex(
									/^[0-9]{4}$/,
									INVALID_YEAR_MESSAGE
								)}
							/>
							<StringFormField
								label='Dödsår'
								field='yearOfDeath'
								value={person.yearOfDeath}
								onChange={updateStringField}
								validate={validateWithRegex(
									/^[0-9]{4}$/,
									INVALID_YEAR_MESSAGE
								)}
							/>
						</Box>
					</Box>

					<Box margin={{ top: 'large', bottom: 'large' }}>
						<StringArray
							stringArray={person.librisIDs}
							label='Libris ID'
							field='librisIDs'
							dispatchPerson={dispatchPerson}
						/>
					</Box>

					<Box margin={{ top: 'large', bottom: 'large' }}>
						<StringArray
							stringArray={person.viafIDs}
							label='VIAF'
							field='viafIDs'
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
									direction='row'
									justify='between'
									align='center'
									margin={{ top: 'small', bottom: 'small' }}
									pad='small'
								>
									<MemoizedTextField
										name={`orcid-${index}`}
										label='ORCID'
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

					<ExternalUrls
						externalURLs={person.externalURLs}
						dispatchPerson={dispatchPerson}
					/>

					<Box margin={{ top: 'large', bottom: 'large' }}>
						<MemoizedTextArea
							key='biografi'
							label='Biografi'
							value={person.biographySwedish}
						/>
						<MemoizedTextArea
							key='biography'
							label='Biography'
							value={person.biographyEnglish}
						/>
					</Box>

					<div data-testid='personDomainParts'>
						<PersonDomainParts
							personDomainPartIds={person.personDomainParts}
							personDomainParts={personDomainParts}
							auth={auth}
							organisationMap={organisationMap}
							dispatchPersonDomainParts={
								dispatchPersonDomainParts
							}
						/>
					</div>

					<OtherOrganisation
						otherAffiliation={person.otherAffiliation}
						dispatchPerson={dispatchPerson}
					/>

					<Public
						publicValue={person.public}
						dispatchPerson={dispatchPerson}
					/>

					<Box
						direction='column'
						align='end'
						margin={{ top: 'medium' }}
					>
						<Button
							type='submit'
							label='Skicka'
							primary
							onClick={() => {
								console.log('Skickar...');
							}}
						/>
					</Box>
				</Form>
			</Box>
			<Box>
				<FormPersonView
					person={person}
					organisations={organisationMap}
					personDomainParts={personDomainParts}
					edit
				/>
			</Box>
			<Box margin={{ left: '1em', top: '1em' }}>
				<BackButton />
			</Box>
		</Grid>
	);
};

export const validateWithRegex =
	(regex: RegExp, invalidMessage: string) => (value: string) => {
		if (value === undefined || value === '' || regex.test(value)) {
			return undefined;
		}
		return invalidMessage;
	};

export default PersonEdit;
