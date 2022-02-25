import React from 'react';
import {
	Organisation,
	PersonDomainPart,
	RecordType,
} from 'diva-cora-ts-api-wrapper';
import getDomainCollection from '../../divaData/collections';
import ListWithLabel from './ListWithLabel';
import RecordFetcher from '../RecordFetcher';
import AffiliationDisplay from './AffiliationDisplay';

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
			<h2>{title}</h2>
			{personDomainPart.identifiers && (
				<ListWithLabel
					list={personDomainPart.identifiers}
					label="Lokal identifikator"
				/>
			)}
			{personDomainPart.affiliations &&
				personDomainPart.affiliations.map((organisation) => {
					return (
						<RecordFetcher<Organisation>
							recordType={RecordType.Organisation}
							id={organisation.id}
							key={organisation.id}
						>
							{(injectedProps) => (
								<AffiliationDisplay
									affiliation={{
										name: injectedProps.record.name,
										fromYear: organisation.fromYear,
										untilYear: organisation.untilYear,
									}}
								/>
							)}
						</RecordFetcher>
					);
				})}
		</>
	);
};

export default PersonDomainPartView;
