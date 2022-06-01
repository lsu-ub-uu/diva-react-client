import React from 'react';
import { Box, Card, CardHeader, Heading } from 'grommet';
import getDomainCollection from '../../../divaData/resources';
import {
	PersonDomainpartAction,
	PersonDomainPartActionType,
} from './personDomainPartReducer';
import { FormPersonDomainPart } from '../../../types/FormPersonDomainPart';
import { Auth } from '../../../context/types';
import { MemoizedFormField } from './MemoizedFormField';
import { TrashButton } from './Buttons';
import { validateWithRegex, INVALID_YEAR_MESSAGE } from './PersonEdit';

export const PersonDomainParts = React.memo(
	({
		personDomainPartIds,
		personDomainParts,
		auth,
		organisationMap,
		dispatchPersonDomainParts,
	}: {
		personDomainPartIds: string[];
		personDomainParts: FormPersonDomainPart[];
		auth: Auth;
		organisationMap: Map<string, string>;
		dispatchPersonDomainParts: (value: PersonDomainpartAction) => void;
	}) => {
		return (
			<Box>
				{personDomainPartIds.length > 0 &&
					personDomainPartIds.map((pdpId) => {
						const personDomainPart = personDomainParts.find(
							(pdp) => pdp.id === pdpId
						);
						if (!personDomainPart || personDomainPart.domain !== auth.domain) {
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
			</Box>
		);
	}
);

export default PersonDomainParts;
