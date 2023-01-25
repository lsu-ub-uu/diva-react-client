import React from 'react';
import styled from 'styled-components';
import {
	Organisation,
	PersonDomainPart,
	RecordType,
} from 'diva-cora-ts-api-wrapper';
import { Text } from 'grommet';
import getDomainCollection from '../../divaData/resources';
import RecordFetcher from '../RecordFetcher';
import AffiliationDisplay from './AffiliationDisplay';

const StyledUl = styled.ul`
	padding-left: 1em;
`;

const PersonDomainPartView = function ({
	personDomainPart,
}: {
	personDomainPart: PersonDomainPart;
}) {
	const domainCollection = getDomainCollection();

	const title =
		domainCollection.get(personDomainPart.domain) ||
		`DomänId: ${personDomainPart.domain}`;

	return (
		<>
			<h3>{title}</h3>
			{personDomainPart.identifiers && (
				<Text size='small'>
					Lokal identifikator: {personDomainPart.identifiers[0]}
				</Text>
			)}

			{personDomainPart.affiliations &&
				personDomainPart.affiliations.length && (
					<StyledUl>
						{personDomainPart.affiliations.map((organisation) => {
							return (
								<li key={organisation.id}>
									<RecordFetcher<Organisation>
										recordType={RecordType.Organisation}
										id={organisation.id}
									>
										{(injectedProps) => (
											<AffiliationDisplay
												affiliation={{
													name: injectedProps.record
														.name,
													fromYear:
														organisation.fromYear,
													untilYear:
														organisation.untilYear,
												}}
											/>
										)}
									</RecordFetcher>
								</li>
							);
						})}
					</StyledUl>
				)}
		</>
	);
};

export default PersonDomainPartView;
