import React from 'react';
import { FormPersonDomainPart } from '../../types/FormPersonDomainPart';

export const Organisations = function ({
	personDomainPartIds,
	personDomainParts,
	organisations,
}: {
	personDomainPartIds: string[];
	personDomainParts: FormPersonDomainPart[];
	organisations: Map<string, string>;
}) {
	if (personDomainPartIds.length === 0) {
		return null;
	}

	return (
		<ul>
			{personDomainPartIds.map((id) => {
				return <li key={id}></li>;
			})}
		</ul>
	);
};

export default Organisations;
