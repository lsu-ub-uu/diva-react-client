import React from 'react';
import { PersonDomainPart } from '../../cora/types/PersonDomainPart';
import getDomainCollection from '../../divaData/collections';
import OrganisationFetcher from '../OrganisationFetcher';
import ListWithLabel from './ListWithLabel';

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
						<OrganisationFetcher key={organisation.id} id={organisation.id} />
					);
				})}
		</>
	);
};

export default PersonDomainPartView;
