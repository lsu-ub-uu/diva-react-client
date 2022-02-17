import React from 'react';
import { PersonDomainPart } from '../../cora/types/PersonDomainPart';
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
		</>
	);
};

export default PersonDomainPartView;
