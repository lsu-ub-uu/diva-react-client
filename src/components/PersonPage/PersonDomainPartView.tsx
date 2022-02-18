import React from 'react';
import { PersonDomainPart } from '../../cora/types/PersonDomainPart';
import OrganisationFetcher from '../OrganisationFetcher';
import ListWithLabel from './ListWithLabel';

const PersonDomainPartView = function ({
	personDomainPart,
}: {
	personDomainPart: PersonDomainPart;
}) {
	return (
		<>
			<p>PersonDomainPart: {personDomainPart.id}</p>
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
