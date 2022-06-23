import { Heading } from 'grommet';
import React from 'react';
import { FormPersonDomainPart } from '../../types/FormPersonDomainPart';
import FormPersonDomainPartView from './FormPersonDomainPartView';

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
		<>
			<Heading level={4}>Organisationer</Heading>
			<ul>
				{personDomainPartIds.map((id) => {
					const personDomainPart = personDomainParts.find(
						(pdp) => pdp.id === id
					);

					if (!personDomainPart) {
						return (
							<li key={id}>
								{`Kunde inte hitta information för PersonDomainPart "${id}".`}
							</li>
						);
					}

					return (
						<li key={id}>
							<FormPersonDomainPartView
								organisations={organisations}
								personDomainPart={personDomainPart}
							/>
						</li>
					);
				})}
			</ul>
		</>
	);
};

export default Organisations;
