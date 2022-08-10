import { Heading, Box } from 'grommet';
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
		<Box>
			<Heading level={3}>Organisationer</Heading>
			<Box>
				{personDomainPartIds.map((id) => {
					const personDomainPart = personDomainParts.find(
						(pdp) => pdp.id === id
					);

					if (!personDomainPart) {
						return (
							<p key={id}>
								{`Kunde inte hitta information för PersonDomainPart "${id}".`}
							</p>
						);
					}

					return (
						<p key={id}>
							<FormPersonDomainPartView
								organisations={organisations}
								personDomainPart={personDomainPart}
							/>
						</p>
					);
				})}
			</Box>
		</Box>
	);
};

export default Organisations;
